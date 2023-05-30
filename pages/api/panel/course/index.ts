import { zCourseCreate, zCourseUpdate } from "@models/iCourse";
import { errorType, onErrorResponse, onSuccessResponse, onZodErrorResponse } from "@providers/apiResponseHandler";
import CoursePrismaProvider from "@providers/prismaProviders/coursePrisma";
import { removeCookieToken, tokenValidator } from "@providers/tokenProvider";
import { errorLogger } from "@utilities/apiLogger";
import { NextApiRequest, NextApiResponse } from "next";

const coursePrismaProvider = new CoursePrismaProvider();
export default async function apiHandler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) {
				removeCookieToken({ req, res });
				return res.json(onErrorResponse("bad user request"));
			}

			// prisma
			const courses = await coursePrismaProvider.getByAuthor(token.userId);

			// api
			return res.json(onSuccessResponse(courses));
		} catch (error) {
			return errorLogger({ error, res, name: "course" });
		}
	}

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
			const validateData = zCourseCreate.safeParse(req.body);
			if (!validateData.success) return res.json(onZodErrorResponse(validateData.error.issues));
			const { title } = validateData.data;

			// prisma unique
			const notUnique = await coursePrismaProvider.checkUniqueField({ title });

			// validation
			if (notUnique) {
				const uniqueErrors: errorType = {};
				if (title === notUnique.content.title) uniqueErrors.title = "this title already taken";
				return res.json(onErrorResponse(uniqueErrors));
			}

			// prisma create
			const body = { ...validateData.data, authorId: token.userId };
			const course = await coursePrismaProvider.create(body);

			// api
			return res.json(onSuccessResponse(course));
		} catch (error) {
			return errorLogger({ error, res, name: "course" });
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
			const validateData = zCourseUpdate.safeParse(req.body);
			if (!validateData.success) return res.json(onZodErrorResponse(validateData.error.issues));
			const { id, title, description, categoryId, keywords } = validateData.data;

			// prisma check course author
			const author = await coursePrismaProvider.checkCourseAuthor({ courseId: id });
			if (author === null) return res.json(onErrorResponse("this course not exist"));
			if (author.content.authorId !== token.userId) return res.json(onErrorResponse("Error course access denied!"));

			// unique check
			const notUnique = await coursePrismaProvider.checkUniqueField({ title, courseId: id });
			if (notUnique) {
				const uniqueErrors: errorType = {};
				if (title === notUnique.content.title) uniqueErrors.title = "this title already taken";
				return res.json(onErrorResponse(uniqueErrors));
			}

			// prisma
			const course = await coursePrismaProvider.update({
				courseId: id,
				title,
				description,
				categoryId,
				keywords,
				authorId: token.userId,
			});

			// api
			return res.json(onSuccessResponse(course));
		} catch (error) {
			return errorLogger({ error, res, name: "course" });
		}
	}

	// not supported method
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
