import { zCommentCreate, zCommentDelete, zCommentGet, zCommentUpdate } from "@models/iComment";
import { onErrorResponse, onSuccessResponse, onZodErrorResponse } from "@providers/apiResponseHandler";
import CommentPrismaProvider from "@providers/prismaProviders/commentPrisma";
import { tokenFixer, tokenValidator } from "@providers/tokenProvider";
import { errorLogger } from "@utilities/apiLogger";
import { sleep } from "@utilities/devSleep";
import { NextApiRequest, NextApiResponse } from "next";

const commentPrismaProvider = new CommentPrismaProvider();
export default async function apiHandler(req: NextApiRequest, res: NextApiResponse) {
	// get by contentId
	if (req.method === "GET") {
		try {
			const contentId = parseInt(req.query.contentId as string);
			if (!contentId) return res.json(onErrorResponse("comment bad request"));

			// prisma
			const comments = await commentPrismaProvider.getByContentId({ contentId });

			// api
			return res.json(onSuccessResponse(comments));
		} catch (error) {
			return errorLogger({ error, res, name: "get comments" });
		}
	}

	// get by parentId
	if (req.method === "DELETE") {
		try {
			const parentId = parseInt(req.query.parentId as string);
			if (!parentId) return res.json(onErrorResponse("comment bad request"));

			// prisma
			const comments = await commentPrismaProvider.getByParentId({ parentId });

			// api
			return res.json(onSuccessResponse(comments));
		} catch (error) {
			return errorLogger({ error, res, name: "get comments" });
		}
	}

	// on create
	if (req.method === "POST") {
		try {
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) return tokenFixer({ req, res });

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

	// on update
	if (req.method === "PUT") {
		try {
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) return tokenFixer({ req, res });

			const validateData = zCommentUpdate.safeParse(req.body);
			if (!validateData.success) return res.json(onZodErrorResponse(validateData.error.issues));

			// check Author
			const author = await commentPrismaProvider.checkAuthor({ id: validateData.data.id });
			if (author?.authorId !== token.userId) return res.json(onErrorResponse("comment access denied!"));

			// prisma
			const comments = await commentPrismaProvider.update(validateData.data);

			// api
			return res.json(onSuccessResponse(comments));
		} catch (error) {
			return errorLogger({ error, res, name: "create comment" });
		}
	}

	// on delete
	if (req.method === "PATCH") {
		try {
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) return tokenFixer({ req, res });

			const validateData = zCommentDelete.safeParse(req.body);
			if (!validateData.success) return res.json(onZodErrorResponse(validateData.error.issues));

			// check Author
			const author = await commentPrismaProvider.checkAuthor({ id: validateData.data.id });
			if (author?.authorId !== token.userId) return res.json(onErrorResponse("comment access denied!"));

			// prisma
			const comment = await commentPrismaProvider.delete({ id: validateData.data.id });

			// api
			return res.json(onSuccessResponse(comment));
		} catch (error) {
			return errorLogger({ error, res, name: "create comment" });
		}
	}

	// not supported method
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
