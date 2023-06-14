import { zResumeFeed } from "@models/iResume";
import { onErrorResponse, onSuccessResponse, onZodErrorResponse } from "@providers/apiResponseHandler";
import ResumePrismaProvider from "@providers/prismaProviders/resumePrisma";
import { tokenValidator } from "@providers/tokenProvider";
import { errorLogger } from "@utilities/apiLogger";
import { NextApiRequest, NextApiResponse } from "next";

const resumePrismaProvider = new ResumePrismaProvider();
export default async function apiHandler(req: NextApiRequest, res: NextApiResponse) {
	// resume
	if (req.method === "GET") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			const viewerId = token ? token.userId : undefined;

			const validateData = zResumeFeed.safeParse(req.query);
			if (!validateData.success) return res.json(onZodErrorResponse(validateData.error.issues));
			const { username } = validateData.data;

			// prisma
			const resume = await resumePrismaProvider.getResumeFeed({ username, viewerId });

			// api
			return res.json(onSuccessResponse(resume));
		} catch (error) {
			return errorLogger({ error, res, name: "course" });
		}
	}

	// not supported method
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
