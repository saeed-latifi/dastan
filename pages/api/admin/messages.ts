import { zCreateAdminMessage } from "@models/iAdminMessage";
import { onErrorResponse, onSuccessResponse, onZodErrorResponse } from "@providers/apiResponseHandler";
import AdminMessagesPrismaProvider from "@providers/prismaProviders/adminMessagePrisma";
import { tokenFixer, tokenValidator } from "@providers/tokenProvider";
import { errorLogger } from "@utilities/apiLogger";
import { permissionHasAccess } from "@utilities/permissionChecker";
import { NextApiRequest, NextApiResponse } from "next";

const adminMessagesPrismaProvider = new AdminMessagesPrismaProvider();
export default async function changeEmailApi(req: NextApiRequest, res: NextApiResponse) {
	// get admin messages
	if (req.method === "POST") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) return tokenFixer({ req, res });
			const hasAccess = permissionHasAccess({ current: token.permission, require: "ADMIN" });
			if (!hasAccess) return res.json(onErrorResponse("access denied"));

			// validation
			const validation = zCreateAdminMessage.safeParse(req.body);
			if (!validation.success) return res.json(onZodErrorResponse(validation.error.issues));
			const { description, title, userId } = validation.data;

			// prisma
			const message = await adminMessagesPrismaProvider.add({ userId, title, description });

			// api
			return res.json(onSuccessResponse(message));
		} catch (error) {
			return errorLogger({ error, res, name: "email" });
		}
	}

	// not supported
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
