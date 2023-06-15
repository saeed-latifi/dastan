import { zCommentCreate, zCommentGet } from "@models/iComment";
import { onErrorResponse, onSuccessResponse, onZodErrorResponse } from "@providers/apiResponseHandler";
import CommentPrismaProvider from "@providers/prismaProviders/commentPrisma";
import { removeCookieToken, tokenValidator } from "@providers/tokenProvider";
import { errorLogger } from "@utilities/apiLogger";
import { NextApiRequest, NextApiResponse } from "next";

const commentPrismaProvider = new CommentPrismaProvider();
export default async function apiHandler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET") {
		try {
			const contentId = parseInt(req.query.contentId as string);
			console.log(contentId);

			if (!contentId) return res.json(onErrorResponse("comment bad request"));

			// prisma
			const comments = await commentPrismaProvider.getByContentId({ contentId });

			// api
			return res.json(onSuccessResponse(comments));
		} catch (error) {
			return errorLogger({ error, res, name: "get comments" });
		}
	}

	if (req.method === "POST") {
		try {
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) {
				removeCookieToken({ req, res });
				return res.json(onErrorResponse("bad comment request"));
			}

			const validateData = zCommentCreate.safeParse(req.body);
			if (!validateData.success) return res.json(onZodErrorResponse(validateData.error.issues));

			// prisma
			const comments = await commentPrismaProvider.create({ body: validateData.data, authorId: token.userId });

			// api
			return res.json(onSuccessResponse(comments));
		} catch (error) {
			return errorLogger({ error, res, name: "create comment" });
		}
	}

	// not supported method
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
