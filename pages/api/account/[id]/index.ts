import { zPasswordUpdate, zUserUpdate } from "@models/iUser";
import zodErrorMapper, { iValidationWarnings, onErrorResponse, onNotValidResponse, onSuccessResponse } from "@providers/apiResponseHandler";
import UserPrismaProvider from "@providers/prismaProviders/userPrisma";
import { removeCookieToken, tokenValidator } from "@providers/tokenProvider";
import { NextApiRequest, NextApiResponse } from "next";

const userPrismaProvider = new UserPrismaProvider();
export default async function apiHandler(req: NextApiRequest, res: NextApiResponse) {
	// token
	// validation
	// prisma
	// api

	// update user
	if (req.method === "PUT") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) {
				removeCookieToken({ req, res });
				return res.json(onErrorResponse("bad user request"));
			}

			// validation !
			const validateUpdate = zUserUpdate.safeParse(req.body);
			if (!validateUpdate.success) return res.json(zodErrorMapper(validateUpdate.error.issues));

			// prisma
			const { username } = validateUpdate.data;

			// check not repetitive
			const notUnique = await userPrismaProvider.checkUniqueField({ username, userId: token.userId });
			if (notUnique === "ERR") return res.json(onErrorResponse("Error on update ORM"));

			// on repetitive
			if (notUnique) {
				const validationWarnings: iValidationWarnings[] = [];
				if (username === notUnique.username)
					validationWarnings.push({ name: "username", message: "this username already is exist" });

				return res.json(onNotValidResponse(validationWarnings));
			}

			const body: any = {
				...validateUpdate.data,
			};

			if (validateUpdate.data.interests) {
				body.interests = { set: validateUpdate.data.interests.map((cat) => ({ id: cat.id })) };
			}

			// prisma
			const user = await userPrismaProvider.update(token.userId, body);
			if (user === "ERR") return res.json(onErrorResponse("Error on update ORM"));

			// api
			return res.json(onSuccessResponse(user));
		} catch (error) {
			return res.json(onErrorResponse("err on update user"));
		}
	}

	// change password
	else if (req.method === "PATCH") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) {
				removeCookieToken({ req, res });
				return res.json(onErrorResponse("bad user request"));
			}

			// validation !
			const validateUpdate = zPasswordUpdate.safeParse(req.body);
			if (!validateUpdate.success) return res.json(zodErrorMapper(validateUpdate.error.issues));

			// prisma check password
			const hasPassword = await userPrismaProvider.checkPassword({ id: token.userId, password: validateUpdate.data.oldPassword });
			if (hasPassword === "ERR") return res.json(onErrorResponse("Error on update ORM"));
			if (hasPassword === null) return res.json(onErrorResponse("your old password is not correct"));

			// prisma
			const user = await userPrismaProvider.update(token.userId, { password: validateUpdate.data.newPassword });
			if (user === "ERR") return res.json(onErrorResponse("Error on update ORM"));

			// api
			return res.json(onSuccessResponse("password updated"));
		} catch (error) {
			return res.json(onErrorResponse("err on update password"));
		}
	}

	// not supported method
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
