import { zUserLogin } from "@models/iUser";
import zodErrorMapper, { onErrorResponse, onNotValidResponse, onSuccessResponse } from "@providers/apiResponseHandler";
import { changeEmailEmailSender } from "@providers/emailService";
import UserPrismaProvider from "@providers/prismaProviders/userPrisma";
import { changeEmailTokenValidator, removeCookieToken, tokenValidator } from "@providers/tokenProvider";
import { NextApiRequest, NextApiResponse } from "next";

const userPrismaProvider = new UserPrismaProvider();
export default async function changeEmailApi(req: NextApiRequest, res: NextApiResponse) {
	// token
	// validation
	// prisma
	// api

	// change email request
	if (req.method === "POST") {
		console.log("body : ", req.body);

		// token
		const token = tokenValidator(req?.cookies?.token as string);
		if (!token) {
			removeCookieToken({ req, res });
			return res.json(onErrorResponse("bad identify"));
		}

		// validation
		const validateData = zUserLogin.safeParse(req.body);
		if (!validateData.success) return res.json(zodErrorMapper(validateData.error.issues));

		// prisma check password
		const hasPassword = await userPrismaProvider.checkPassword({ id: token.userId, password: validateData.data.password });
		if (hasPassword === "ERR") return res.json(onErrorResponse("Error on password ORM"));
		if (hasPassword === null) return res.json(onErrorResponse("your password is not correct"));

		// prisma
		const user = await userPrismaProvider.getOne(token.userId);
		if (user === "ERR") return res.json(onErrorResponse("err on identify ORM"));
		if (user === null) return res.json(onNotValidResponse([{ name: "not found", message: "not found this user" }]));

		const emailRes = await changeEmailEmailSender({ newEmail: validateData.data.email, oldEmail: user.email });
		console.log("emailRes :: ", emailRes);

		if (!emailRes) return res.json(onErrorResponse("It failed to send the email, please try again"));

		// api
		return res.json(onSuccessResponse("recover email send"));
	}

	// verify new Email
	else if (req.method === "PATCH") {
		try {
			// token
			const emailToken = changeEmailTokenValidator(req.body.token);
			if (!emailToken) return res.json(onErrorResponse("activate failed! perhaps email expired! pleases try again"));

			// prisma
			const user = await userPrismaProvider.changeEmail({ newEmail: emailToken.newEmail, oldEmail: emailToken.oldEmail });
			if (user === "ERR") return res.json(onErrorResponse("Error on email ORM"));

			return res.json(onSuccessResponse(user));
		} catch (error) {
			return res.json(onErrorResponse("err on logout"));
		}
	}
	// not supported
	else {
		return res.send("not allowed method");
	}
}
