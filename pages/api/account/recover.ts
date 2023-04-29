import { zUserEmail, zResetPassword } from "@models/iUser";
import zodErrorMapper, { onErrorResponse, onNotValidResponse, onSuccessResponse } from "@providers/apiResponseHandler";
import { authEmailSender, recoverPasswordEmailSender } from "@providers/emailService";
import UserPrismaProvider from "@providers/prismaProviders/userPrisma";
import { emailTokenValidator } from "@providers/tokenProvider";
import { NextApiRequest, NextApiResponse } from "next";

const userPrismaProvider = new UserPrismaProvider();
export default async function recoverAccountApi(req: NextApiRequest, res: NextApiResponse) {
	// token
	// validation
	// prisma
	// api

	// forget password request
	if (req.method === "POST") {
		// validation
		const validateData = zUserEmail.safeParse(req.body);
		if (!validateData.success) return res.json(zodErrorMapper(validateData.error.issues));

		// prisma
		const user = await userPrismaProvider.getByEmail(validateData.data);
		if (user === "ERR") return res.json(onErrorResponse("Error on recover ORM"));
		if (user === null) return res.json(onErrorResponse("this email is not registered"));

		// email
		const emailRes = await recoverPasswordEmailSender({ email: user.email });
		if (!emailRes) return res.json(onErrorResponse("It failed to send the email, please try again"));

		// api
		return res.json(onSuccessResponse("recover email send"));
	}

	// recover (new) password
	if (req.method === "PUT") {
		// token
		const emailToken = emailTokenValidator(req.body.token);
		if (!emailToken) return res.json(onErrorResponse("not valid date please make another request"));

		// validation
		const validateData = zResetPassword.safeParse(req.body);
		if (!validateData.success) return res.json(zodErrorMapper(validateData.error.issues));

		// prisma
		const user = await userPrismaProvider.resetPassword({ email: emailToken.email, password: validateData.data.password });
		if (user === "ERR") return res.json(onErrorResponse("Error on reset password ORM"));

		return res.json(onSuccessResponse("password reset"));
	}

	// re send activation email
	if (req.method === "PATCH") {
		// validation
		const validateData = zUserEmail.safeParse(req.body);
		if (!validateData.success) return res.json(zodErrorMapper(validateData.error.issues));

		// prisma
		const user = await userPrismaProvider.getByEmail(validateData.data);
		if (user === "ERR") return res.json(onErrorResponse("Error on recover ORM"));
		if (user === null) return res.json(onErrorResponse("this email is not registered"));
		// TODO check isDeleted
		if (user.isActive) return res.json(onNotValidResponse([{ name: "already", message: "your account is already verified" }]));

		// email
		const emailRes = await authEmailSender({ email: user.email });
		if (!emailRes) return res.json(onErrorResponse("It failed to send the email, please try again"));

		// api
		return res.json(onSuccessResponse("verification email sended"));
	}

	// not supported
	else {
		return res.send("not allowed method");
	}
}
