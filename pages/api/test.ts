import { onErrorResponse } from "@providers/apiResponseHandler";
import CoursePrismaProvider from "@providers/prismaProviders/coursePrisma";
import { tokenValidator } from "@providers/tokenProvider";
import { NextApiRequest, NextApiResponse } from "next";

const coursePrismaProvider = new CoursePrismaProvider();
export default async function apiHandler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);

			// prisma
			const courses = await coursePrismaProvider.getSome({ userId: token ? token.userId : undefined });

			// ok res
			return res.json(courses);
		} catch (error) {}
	}

	// not supported method
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
