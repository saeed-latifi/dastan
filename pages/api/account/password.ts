import { zUserEmail, zResetPassword, zPasswordUpdate } from "@models/iUser";
import { onErrorResponse, onSuccessResponse, onZodErrorResponse } from "@providers/apiResponseHandler";
import { recoverPasswordEmailSender } from "@providers/emailService";
import UserPrismaProvider from "@providers/prismaProviders/userPrisma";
import { emailTokenValidator, tokenFixer, tokenValidator } from "@providers/tokenProvider";
import { errorLogger } from "@utilities/apiLogger";
import { NextApiRequest, NextApiResponse } from "next";

const userPrismaProvider = new UserPrismaProvider();
export default async function recoverAccountApi(req: NextApiRequest, res: NextApiResponse) {
	// forget password request
	if (req.method === "POST") {
		try {
			// validation
			const validateData = zUserEmail.safeParse(req.body);
			if (!validateData.success) return res.json(onZodErrorResponse(validateData.error.issues));

			// prisma
			const user = await userPrismaProvider.getByEmail(validateData.data);
			if (user === null) return res.json(onErrorResponse("this email is not registered"));

			// email
			const emailRes = await recoverPasswordEmailSender({ email: user.email });
			if (!emailRes) return res.json(onErrorResponse("It failed to send the email, please try again"));

			// api
			return res.json(onSuccessResponse("recover email send"));
		} catch (error) {
			return errorLogger({ error, res, name: "password" });
		}
	}

	// recover (new) password
	if (req.method === "PUT") {
		try {
			// token
			const emailToken = emailTokenValidator(req.body.token);
			if (!emailToken) return res.json(onErrorResponse("not valid date please make another request"));

			// validation
			const validateData = zResetPassword.safeParse(req.body);
			if (!validateData.success) return res.json(onZodErrorResponse(validateData.error.issues));

			// prisma
			const user = await userPrismaProvider.resetPassword({ email: emailToken.email, password: validateData.data.password });

			return res.json(onSuccessResponse("password reset"));
		} catch (error) {
			return errorLogger({ error, res, name: "password" });
		}
	}

	// change password
	if (req.method === "PATCH") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) return tokenFixer({ req, res });

			// validation !
			const validateUpdate = zPasswordUpdate.safeParse(req.body);
			if (!validateUpdate.success) return res.json(onZodErrorResponse(validateUpdate.error.issues));

			// prisma check password
			const hasPassword = await userPrismaProvider.checkPassword({ id: token.userId, password: validateUpdate.data.oldPassword });
			if (hasPassword === null) return res.json(onErrorResponse("your old password is not correct"));

			// prisma
			const user = await userPrismaProvider.changePassword({ userId: token.userId, password: validateUpdate.data.newPassword });

			// api
			return res.json(onSuccessResponse("password updated"));
		} catch (error) {
			return errorLogger({ error, res, name: "password" });
		}
	}

	// not supported
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
