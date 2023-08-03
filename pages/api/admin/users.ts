import { zPagination } from "@models/iPagination";
import { zAddMessageTicket, zAdminUsers } from "@models/iTicket";
import { onErrorResponse, onSuccessResponse, onZodErrorResponse } from "@providers/apiResponseHandler";
import UserPrismaProvider from "@providers/prismaProviders/userPrisma";
import { tokenFixer, tokenValidator } from "@providers/tokenProvider";
import { errorLogger } from "@utilities/apiLogger";
import { permissionHasAccess } from "@utilities/permissionChecker";
import { NextApiRequest, NextApiResponse } from "next";

const userPrismaProvider = new UserPrismaProvider();
export default async function changeEmailApi(req: NextApiRequest, res: NextApiResponse) {
	// get AdminUsers
	if (req.method === "POST") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) return tokenFixer({ req, res });
			const hasAccess = permissionHasAccess({ current: token.permission, require: "ADMIN" });

			if (!hasAccess) return res.json(onErrorResponse("access denied"));

			// validation
			const pagination = zPagination.safeParse(req.body);
			if (!pagination.success) return res.json(onZodErrorResponse(pagination.error.issues));
			const { skip, take } = pagination.data;

			const validation = zAdminUsers.safeParse(req.body);
			if (!validation.success) return res.json(onZodErrorResponse(validation.error.issues));
			const { isActive } = validation.data;

			// prisma
			const AdminUsers = await userPrismaProvider.adminUsersList({ skip, take, isActive });

			// api
			return res.json(onSuccessResponse(AdminUsers));
		} catch (error) {
			return errorLogger({ error, res, name: "adminUsers" });
		}
	}

	// not supported
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
