import { zPagination } from "@models/iPagination";
import { onErrorResponse, onSuccessResponse, onZodErrorResponse } from "@providers/apiResponseHandler";
import AdminMessagesPrismaProvider from "@providers/prismaProviders/adminMessagePrisma";
import { tokenFixer, tokenValidator } from "@providers/tokenProvider";
import { errorLogger } from "@utilities/apiLogger";
import { NextApiRequest, NextApiResponse } from "next";

const adminMessagesPrismaProvider = new AdminMessagesPrismaProvider();
export default async function changeEmailApi(req: NextApiRequest, res: NextApiResponse) {
	// get admin messages
	if (req.method === "POST") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) return tokenFixer({ req, res });

			// validation
			const validation = zPagination.safeParse(req.body);
			if (!validation.success) return res.json(onZodErrorResponse(validation.error.issues));
			const { skip, take } = validation.data;

			// prisma
			const messages = await adminMessagesPrismaProvider.get({ userId: token.userId, take, skip });

			// api
			return res.json(onSuccessResponse(messages));
		} catch (error) {
			return errorLogger({ error, res, name: "email" });
		}
	}

	// on view
	if (req.method === "GET") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) return tokenFixer({ req, res });

			// prisma
			const messages = await adminMessagesPrismaProvider.view(token.userId);

			// api
			return res.json(onSuccessResponse(messages));
		} catch (error) {
			return errorLogger({ error, res, name: "email" });
		}
	}

	// on view
	if (req.method === "DELETE") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) return tokenFixer({ req, res });

			// prisma
			const messages = await adminMessagesPrismaProvider.delete(token.userId);

			// api
			return res.json(onSuccessResponse(messages));
		} catch (error) {
			return errorLogger({ error, res, name: "email" });
		}
	}

	// not supported
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
