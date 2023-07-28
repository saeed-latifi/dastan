import { zAdminMessagesGet, zCreateAdminMessage } from "@models/iAdminMessage";
import { zPagination } from "@models/iPagination";
import { onErrorResponse, onSuccessResponse, onZodErrorResponse } from "@providers/apiResponseHandler";
import AdminMessagesPrismaProvider from "@providers/prismaProviders/adminMessagePrisma";
import { tokenFixer, tokenValidator } from "@providers/tokenProvider";
import { errorLogger } from "@utilities/apiLogger";
import { permissionHasAccess } from "@utilities/permissionChecker";
import { NextApiRequest, NextApiResponse } from "next";

const adminMessagesPrismaProvider = new AdminMessagesPrismaProvider();
export default async function changeEmailApi(req: NextApiRequest, res: NextApiResponse) {
	// get admin messages
	if (req.method === "PUT") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) return tokenFixer({ req, res });
			const hasAccess = permissionHasAccess({ current: token.permission, require: "ADMIN" });
			console.log(token.permission, hasAccess);

			if (!hasAccess) return res.json(onErrorResponse("access denied"));

			// validation
			const pagination = zPagination.safeParse(req.body);
			if (!pagination.success) return res.json(onZodErrorResponse(pagination.error.issues));
			const { skip, take } = pagination.data;

			const validation = zAdminMessagesGet.safeParse(req.body);
			if (!validation.success) return res.json(onZodErrorResponse(validation.error.issues));
			const { isActive } = validation.data;

			// prisma
			const AdminUsers = await adminMessagesPrismaProvider.getAdminList({ skip, take, isActive });

			// api
			return res.json(onSuccessResponse(AdminUsers));
		} catch (error) {
			return errorLogger({ error, res, name: "email" });
		}
	}

	// create admin message
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
