import { zLessonCreate, zLessonUpdate } from "@models/iLesson";
import { errorType, onErrorResponse, onSuccessResponse, onZodErrorResponse } from "@providers/apiResponseHandler";
import LessonPrismaProvider from "@providers/prismaProviders/lessonPrisma";
import { removeCookieToken, tokenValidator } from "@providers/tokenProvider";
import { errorLogger } from "@utilities/apiLogger";
import { NextApiRequest, NextApiResponse } from "next";

const lessonPrismaProvider = new LessonPrismaProvider();
export default async function apiHandler(req: NextApiRequest, res: NextApiResponse) {
	// token
	// validation
	// prisma
	// api

	// create new course
	if (req.method === "POST") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) {
				removeCookieToken({ req, res });
				return res.json(onErrorResponse("bad user request"));
			}

			// validation
			const validateData = zLessonCreate.safeParse(req.body);
			if (!validateData.success) return res.json(onZodErrorResponse(validateData.error.issues));
			const { title } = validateData.data;

			// prisma unique
			const notUnique = await lessonPrismaProvider.checkUniqueField({ title });
			if (notUnique) {
				const uniqueErrors: errorType = {};
				if (title === notUnique.content.title) uniqueErrors.title = "this title already taken";
				return res.json(onErrorResponse(uniqueErrors));
			}

			// prisma create
			const course = await lessonPrismaProvider.create({ body: validateData.data, authorId: token.userId });

			// api
			return res.json(onSuccessResponse(course));
		} catch (error) {
			return errorLogger({ error, res, name: "lesson" });
		}
	}

	// update course
	if (req.method === "PUT") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) {
				removeCookieToken({ req, res });
				return res.json(onErrorResponse("bad user request"));
			}

			// validation
			const validateData = zLessonUpdate.safeParse(req.body);
			if (!validateData.success) return res.json(onZodErrorResponse(validateData.error.issues));
			const { contentId, title } = validateData.data;

			// prisma check course author
			const author = await lessonPrismaProvider.checkLessonAuthor({ contentId });
			if (author === null) return res.json(onErrorResponse("this course not exist"));
			if (author.content.authorId !== token.userId) return res.json(onErrorResponse("Error course access denied!"));

			// unique check
			const notUnique = await lessonPrismaProvider.checkUniqueField({ title, contentId });
			if (notUnique) {
				const uniqueErrors: errorType = {};
				if (title === notUnique.content.title) uniqueErrors.title = "this title already taken";
				return res.json(onErrorResponse(uniqueErrors));
			}

			// prisma
			const course = await lessonPrismaProvider.update({ body: validateData.data, authorId: token.userId });

			// api
			return res.json(onSuccessResponse(course));
		} catch (error) {
			return errorLogger({ error, res, name: "lesson" });
		}
	}

	// not supported method
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
