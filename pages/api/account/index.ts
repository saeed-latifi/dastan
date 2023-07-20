import { NextApiRequest, NextApiResponse } from "next";
import { onLogOut, setCookieToken, tokenCreator, tokenFixer, tokenValidator } from "@providers/tokenProvider";
import UserPrismaProvider from "@providers/prismaProviders/userPrisma";
import { errorType, onErrorResponse, onSuccessResponse, onZodErrorResponse } from "@providers/apiResponseHandler";
import { zUserCreate, zUserLogin, zUserUpdate } from "@models/iUser";
import { authEmailSender } from "@providers/emailService";
import { errorLogger } from "@utilities/apiLogger";

const userPrismaProvider = new UserPrismaProvider();
export default async function apiHandler(req: NextApiRequest, res: NextApiResponse) {
	// identify
	if (req.method === "GET") {
		try {
			// api
			if (!req?.cookies?.token) return res.json(onSuccessResponse(false));

			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) return tokenFixer({ req, res });

			// prisma
			const user = await userPrismaProvider.getOne(token.userId);
			if (user === null) return res.json(onErrorResponse("not found this user"));

			// api
			return res.json(onSuccessResponse(user));
		} catch (error) {
			return errorLogger({ error, res, name: "account" });
		}
	}

	// register
	else if (req.method === "POST") {
		try {
			// validation
			const validateRegister = zUserCreate.safeParse(req.body);
			if (!validateRegister.success) return res.json(onZodErrorResponse(validateRegister.error.issues));
			const { email, username } = validateRegister.data;

			// prisma

			const notUniqueFields = await userPrismaProvider.checkUniqueField({ username, email });

			// validation
			if (notUniqueFields) {
				const uniqueErrors: errorType = {};
				if (username === notUniqueFields.username) uniqueErrors.username = "this username already taken";
				if (email === notUniqueFields.email) uniqueErrors.email = "this email already taken";
				return res.json(onErrorResponse(uniqueErrors));
			}

			// email
			const emailRes = await authEmailSender({ email: validateRegister.data.email });
			if (!emailRes) return res.json(onErrorResponse("error on sending email. please try again"));

			// prisma
			delete validateRegister.data.confirm;

			const user = await userPrismaProvider.create(validateRegister.data);

			// api
			return res.json(onSuccessResponse("success! check your inbox for verify email"));
		} catch (error) {
			return errorLogger({ error, res, name: "account" });
		}
	}

	// login
	else if (req.method === "PUT") {
		try {
			// validation
			const validateLogin = zUserLogin.safeParse(req.body);
			if (!validateLogin.success) return res.json(onZodErrorResponse(validateLogin.error.issues));

			// prisma
			const user = await userPrismaProvider.checkEmailAuth(validateLogin.data);

			if (user === null) return res.json(onErrorResponse("not valid login"));

			// token
			const token = tokenCreator({ userId: user.id, username: user.username, permission: user.account.permission });

			// api
			setCookieToken({ req, res, token });
			return res.json(onSuccessResponse(user));
		} catch (error) {
			return errorLogger({ error, res, name: "account" });
		}
	}

	// logout
	else if (req.method === "DELETE") {
		try {
			return onLogOut({ req, res });
		} catch (error) {
			return errorLogger({ error, res, name: "account" });
		}
	}

	// update user
	if (req.method === "PATCH") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) return tokenFixer({ req, res });

			// validation
			const validateUpdate = zUserUpdate.safeParse(req.body);
			if (!validateUpdate.success) return res.json(onZodErrorResponse(validateUpdate.error.issues));

			// prisma
			const { username } = validateUpdate.data;

			// check not repetitive
			const notUnique = await userPrismaProvider.checkUniqueField({ username, userId: token.userId });

			// on repetitive
			if (notUnique) {
				const validationErrors: errorType = {};
				if (username === notUnique.username) validationErrors.username = "this username already taken";
				return res.json(onErrorResponse(validationErrors));
			}

			const body: any = {
				...validateUpdate.data,
			};

			if (validateUpdate.data.interests) {
				const interests = validateUpdate.data.interests.map((cat) => ({ id: cat.id }));
				body.interests = interests;
			}

			// prisma
			const user = await userPrismaProvider.update(token.userId, body);

			// api
			return res.json(onSuccessResponse(user));
		} catch (error) {
			return errorLogger({ error, res, name: "account" });
		}
	}

	// not supported method
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
