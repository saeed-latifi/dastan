import { zFollow } from "@models/iResume";
import { onErrorResponse, onSuccessResponse, onZodErrorResponse } from "@providers/apiResponseHandler";
import ResumePrismaProvider from "@providers/prismaProviders/resumePrisma";
import { removeCookieToken, tokenValidator } from "@providers/tokenProvider";
import { errorLogger } from "@utilities/apiLogger";
import { NextApiRequest, NextApiResponse } from "next";

const resumePrismaProvider = new ResumePrismaProvider();
export default async function apiHandler(req: NextApiRequest, res: NextApiResponse) {
	// follow
	if (req.method === "POST") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) {
				removeCookieToken({ req, res });
				return res.json(onErrorResponse("bad  request"));
			}

			const validateData = zFollow.safeParse(req.body);
			if (!validateData.success) return res.json(onZodErrorResponse(validateData.error.issues));
			const { userId } = validateData.data;

			// prisma
			const followed = await resumePrismaProvider.onFollow({ userId, viewerId: token.userId });

			// api
			return res.json(onSuccessResponse(followed));
		} catch (error) {
			return errorLogger({ error, res, name: "course" });
		}
	}

	// not supported method
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
