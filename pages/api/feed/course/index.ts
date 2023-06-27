import { onErrorResponse, onSuccessResponse } from "@providers/apiResponseHandler";
import CoursePrismaProvider from "@providers/prismaProviders/coursePrisma";
import { tokenValidator } from "@providers/tokenProvider";
import { errorLogger } from "@utilities/apiLogger";
import { NextApiRequest, NextApiResponse } from "next";

const coursePrismaProvider = new CoursePrismaProvider();
export default async function apiHandler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);

			// prisma
			const courses = await coursePrismaProvider.getFeed({ userId: token ? token.userId : undefined });

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
