import { zResumeUpdate } from "@models/iResume";
import { onErrorResponse, onSuccessResponse, onZodErrorResponse } from "@providers/apiResponseHandler";
import UserPrismaProvider from "@providers/prismaProviders/userPrisma";
import { tokenValidator } from "@providers/tokenProvider";
import { errorLogger } from "@utilities/apiLogger";
import { NextApiRequest, NextApiResponse } from "next";

const userPrismaProvider = new UserPrismaProvider();
export default async function apiHandler(req: NextApiRequest, res: NextApiResponse) {
	// resume
	if (req.method === "post") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) return res.json(onErrorResponse("resume access denied."));
			const viewerId = token ? token.userId : undefined;

			const validateData = zResumeUpdate.safeParse(req.query);
			if (!validateData.success) return res.json(onZodErrorResponse(validateData.error.issues));
			const { resumeContext } = validateData.data;

			// prisma
			const resume = await userPrismaProvider.updateResume({ userId: token.userId, resumeContext });

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
