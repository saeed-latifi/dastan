import { zLike } from "@models/iLike";
import { onErrorResponse, onSuccessResponse, onZodErrorResponse } from "@providers/apiResponseHandler";
import ContentPrismaProvider from "@providers/prismaProviders/contentPrisma";
import { tokenFixer, tokenValidator } from "@providers/tokenProvider";
import { errorLogger } from "@utilities/apiLogger";
import { NextApiRequest, NextApiResponse } from "next";

const contentPrismaProvider = new ContentPrismaProvider();
export default async function apiHandler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "POST") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) return tokenFixer({ req, res });

			const validateData = zLike.safeParse(req.body);
			if (!validateData.success) return res.json(onZodErrorResponse(validateData.error.issues));
			const { isLike, contentId } = validateData.data;

			// prisma
			const courses = await contentPrismaProvider.onLike({ isLike, contentId, authorId: token.userId });

			// api
			return res.json(onSuccessResponse(courses));
		} catch (error) {
			return errorLogger({ error, res, name: "course" });
		}
	}

	// not supported method
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
