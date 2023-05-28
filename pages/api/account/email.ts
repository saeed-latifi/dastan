import { zUserEmail, zUserLogin } from "@models/iUser";
import { errorType, onErrorResponse, onSuccessResponse, onZodErrorResponse } from "@providers/apiResponseHandler";
import { authEmailSender, changeEmailEmailSender } from "@providers/emailService";
import UserPrismaProvider from "@providers/prismaProviders/userPrisma";
import { changeEmailTokenValidator, emailTokenValidator, removeCookieToken, setCookieToken, tokenCreator, tokenValidator } from "@providers/tokenProvider";
import { NextApiRequest, NextApiResponse } from "next";

const userPrismaProvider = new UserPrismaProvider();
export default async function changeEmailApi(req: NextApiRequest, res: NextApiResponse) {
	// change email request
	if (req.method === "POST") {
		// token
		const token = tokenValidator(req?.cookies?.token as string);
		if (!token) {
			removeCookieToken({ req, res });
			return res.json(onErrorResponse("bad identify"));
		}

		// validation
		const validateData = zUserLogin.safeParse(req.body);
		if (!validateData.success) return res.json(onZodErrorResponse(validateData.error.issues));

		// prisma check password
		const hasPassword = await userPrismaProvider.checkPassword({ id: token.userId, password: validateData.data.password });
		if (hasPassword === "ERR") return res.json(onErrorResponse("Error on password ORM"));
		if (hasPassword === null) return res.json(onErrorResponse("your password is not correct"));

		// check not repetitive
		const notUnique = await userPrismaProvider.checkUniqueField({ email: validateData.data.email, userId: token.userId });
		if (notUnique === "ERR") return res.json(onErrorResponse("Error on update ORM"));

		// on repetitive
		if (notUnique) {
			const validationErrors: errorType = {};
			if (validateData.data.email === notUnique.email) validationErrors.email = "this email already taken";
			return res.json(onErrorResponse(validationErrors));
		}

		// prisma
		const user = await userPrismaProvider.getOne(token.userId);
		if (user === "ERR") return res.json(onErrorResponse("err on identify ORM"));
		if (user === null) return res.json(onErrorResponse("not found this user"));

		// email
		const emailRes = await changeEmailEmailSender({ newEmail: validateData.data.email, oldEmail: user.email });
		if (!emailRes) return res.json(onErrorResponse("It failed to send the email, please try again"));

		// api
		return res.json(onSuccessResponse("recover email send"));
	}

	// verify new Email
	else if (req.method === "PATCH") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) {
				removeCookieToken({ req, res });
				return res.json(onErrorResponse("bad identify"));
			}

			// token
			const emailToken = changeEmailTokenValidator(req.body.token);
			if (!emailToken) return res.json(onErrorResponse("activate failed! perhaps email expired! pleases try again"));

			// check not repetitive
			const notUnique = await userPrismaProvider.checkUniqueField({ email: emailToken.newEmail, userId: token.userId });
			if (notUnique === "ERR") return res.json(onErrorResponse("Error on change email ORM"));

			// on repetitive
			if (notUnique) {
				const validationErrors: errorType = {};
				if (emailToken.newEmail === notUnique.email) validationErrors.email = "this email already taken, change email failed!";
				return res.json(onErrorResponse(validationErrors));
			}

			// prisma
			const user = await userPrismaProvider.changeEmail({ newEmail: emailToken.newEmail, oldEmail: emailToken.oldEmail });
			if (user === "ERR") return res.json(onErrorResponse("Error on email ORM"));

			return res.json(onSuccessResponse(user));
		} catch (error) {
			return res.json(onErrorResponse("err on logout"));
		}
	}

	// re send activation email
	if (req.method === "GET") {
		// validation
		const validateData = zUserEmail.safeParse(req.query);
		if (!validateData.success) return res.json(onZodErrorResponse(validateData.error.issues));

		// prisma
		const user = await userPrismaProvider.getByEmail(validateData.data);
		if (user === "ERR") return res.json(onErrorResponse("Error on recover ORM"));
		if (user === null) return res.json(onErrorResponse("this email is not registered"));
		if (user.account.isActive) return res.json(onErrorResponse("your account is already verified"));

		// email
		const emailRes = await authEmailSender({ email: user.email });
		if (!emailRes) return res.json(onErrorResponse("It failed to send the email, please try again"));

		// api
		return res.json(onSuccessResponse("verification email sended"));
	}

	// Activate user
	else if (req.method === "PUT") {
		try {
			// token
			const emailToken = emailTokenValidator(req.body.token);
			if (!emailToken) return res.json(onErrorResponse("activate failed! perhaps email expired! pleases try again"));

			// prisma
			const user = await userPrismaProvider.Activate(emailToken.email);
			if (user === "ERR") return res.json(onErrorResponse("Error on active ORM"));
			if (user === null) return res.json(onErrorResponse("Error on active bad userInfo"));

			// token
			const authToken = tokenCreator({
				userId: user.id,
				username: user.username,
				permission: user.account.permission,
			});

			// api
			setCookieToken({ req, res, token: authToken });
			return res.json(onSuccessResponse(user));
		} catch (error) {
			return res.json(onErrorResponse("err on logout"));
		}
	}

	// not supported
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
