import { zPagination } from "@models/iPagination";
import { zAddMessageTicket, zAdminOneTicket, zAdminTickets, zUpdateTicketMessage } from "@models/iTicket";
import { onErrorResponse, onSuccessResponse, onZodErrorResponse } from "@providers/apiResponseHandler";
import TicketPrismaProvider from "@providers/prismaProviders/ticketPrisma";
import { tokenFixer, tokenValidator } from "@providers/tokenProvider";
import { errorLogger } from "@utilities/apiLogger";
import { permissionHasAccess } from "@utilities/permissionChecker";
import { NextApiRequest, NextApiResponse } from "next";

const ticketPrismaProvider = new TicketPrismaProvider();
export default async function changeEmailApi(req: NextApiRequest, res: NextApiResponse) {
	// get tickets
	if (req.method === "PUT") {
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

			const validation = zAdminTickets.safeParse(req.body);
			if (!validation.success) return res.json(onZodErrorResponse(validation.error.issues));
			const { isActive, userId } = validation.data;

			// prisma
			const tickets = await ticketPrismaProvider.getAdminTickets({ skip, take, isActive, userId });

			// api
			return res.json(onSuccessResponse(tickets));
		} catch (error) {
			return errorLogger({ error, res, name: "tickets" });
		}
	}

	// get one ticket
	if (req.method === "GET") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) return tokenFixer({ req, res });
			const hasAccess = permissionHasAccess({ current: token.permission, require: "ADMIN" });
			if (!hasAccess) return res.json(onErrorResponse("access denied"));

			// get id from params
			const ticketId = parseInt(req.query.ticketId as string);
			if (!ticketId) return res.json(onErrorResponse("please enter the ticket id"));

			// prisma
			const ticket = await ticketPrismaProvider.getAdminOneTicket({ ticketId });
			if (!ticket) return res.json(onErrorResponse("this ticket id not exists."));

			// api
			return res.json(onSuccessResponse(ticket));
		} catch (error) {
			return errorLogger({ error, res, name: "tickets" });
		}
	}

	// answer tickets
	if (req.method === "POST") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) return tokenFixer({ req, res });
			const hasAccess = permissionHasAccess({ current: token.permission, require: "ADMIN" });
			if (!hasAccess) return res.json(onErrorResponse("access denied"));

			// validation

			const validation = zAddMessageTicket.safeParse(req.body);
			if (!validation.success) return res.json(onZodErrorResponse(validation.error.issues));
			const { description, ticketId } = validation.data;

			// prisma
			const ticket = await ticketPrismaProvider.answer({ description, ticketId });

			// api
			return res.json(onSuccessResponse(ticket));
		} catch (error) {
			return errorLogger({ error, res, name: "tickets" });
		}
	}

	// update answer tickets
	if (req.method === "PATCH") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) return tokenFixer({ req, res });
			const hasAccess = permissionHasAccess({ current: token.permission, require: "ADMIN" });
			if (!hasAccess) return res.json(onErrorResponse("access denied"));

			// validation

			const validation = zUpdateTicketMessage.safeParse(req.body);
			if (!validation.success) return res.json(onZodErrorResponse(validation.error.issues));
			const { description, messageId } = validation.data;

			// prisma
			const ticket = await ticketPrismaProvider.updateAnswer({ description, messageId });

			// api
			return res.json(onSuccessResponse(ticket));
		} catch (error) {
			return errorLogger({ error, res, name: "tickets" });
		}
	}

	// not supported
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
