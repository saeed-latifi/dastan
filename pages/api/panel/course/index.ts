import { zCourseCreate, zCourseUpdate } from "@models/iCourse";
import { errorType, onErrorResponse, onSuccessResponse, onZodErrorResponse } from "@providers/apiResponseHandler";
import CoursePrismaProvider from "@providers/prismaProviders/coursePrisma";
import { removeCookieToken, tokenValidator } from "@providers/tokenProvider";
import { NextApiRequest, NextApiResponse } from "next";

const coursePrismaProvider = new CoursePrismaProvider();
export default async function apiHandler(req: NextApiRequest, res: NextApiResponse) {
	// token
	// validation
	// prisma
	// api
	if (req.method === "GET") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) {
				removeCookieToken({ req, res });
				return res.json(onErrorResponse("bad user request"));
			}

			// prisma
			const courses = await coursePrismaProvider.getSome(token.userId);
			if (courses === "ERR") return res.json(onErrorResponse("Error on course ORM"));

			// api
			return res.json(onSuccessResponse(courses));
		} catch (error) {
			return res.json(onErrorResponse("err on create course"));
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
			if (notUnique === "ERR") return res.json(onErrorResponse("Error on course ORM"));

			// validation
			if (notUnique) {
				const uniqueErrors: errorType = {};
				if (title === notUnique.title) uniqueErrors.title = "this title already taken";
				return res.json(onErrorResponse(uniqueErrors));
			}

			// prisma create
			const body = { ...validateData.data, authorId: token.userId };
			const course = await coursePrismaProvider.create(body);
			if (course === "ERR") return res.json(onErrorResponse("Error on course ORM"));

			// api
			return res.json(onSuccessResponse(course));
		} catch (error) {
			return res.json(onErrorResponse("err on create course"));
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
			const { contentId, title, description, categoryId, keywords } = validateData.data;

			// prisma check course author
			const author = await coursePrismaProvider.checkCourseAuthor({ contentId });
			if (author === "ERR") return res.json(onErrorResponse("Error on course ORM"));
			if (author === null) return res.json(onErrorResponse("this course not exist"));
			if (author.authorId !== token.userId) return res.json(onErrorResponse("Error course access denied!"));

			// unique check
			const notUnique = await coursePrismaProvider.checkUniqueField({ title, contentId });
			if (notUnique === "ERR") return res.json(onErrorResponse("Error on course ORM"));
			if (notUnique) {
				const uniqueErrors: errorType = {};
				if (title === notUnique.title) uniqueErrors.title = "this title already taken";
				return res.json(onErrorResponse(uniqueErrors));
			}

			// prisma
			const course = await coursePrismaProvider.update({
				contentId,
				title,
				description,
				categoryId,
				keywords,
				authorId: token.userId,
			});
			if (course === "ERR") return res.json(onErrorResponse("Error on course ORM"));

			// api
			return res.json(onSuccessResponse(course));
		} catch (error) {
			return res.json(onErrorResponse("err on update course"));
		}
	}

	// not supported method
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
