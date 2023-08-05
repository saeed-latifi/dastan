import { zPagination } from "@models/iPagination";
import { zAddMessageTicket, zCreateTicket } from "@models/iTicket";
import { onErrorResponse, onSuccessResponse, onZodErrorResponse } from "@providers/apiResponseHandler";
import TicketPrismaProvider from "@providers/prismaProviders/ticketPrisma";
import { tokenFixer, tokenValidator } from "@providers/tokenProvider";
import { errorLogger } from "@utilities/apiLogger";
import { NextApiRequest, NextApiResponse } from "next";

const ticketPrismaProvider = new TicketPrismaProvider();
export default async function ticketPanelApi(req: NextApiRequest, res: NextApiResponse) {
	// create ticket
	if (req.method === "POST") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) return tokenFixer({ req, res });

			// validation
			const validation = zCreateTicket.safeParse(req.body);
			if (!validation.success) return res.json(onZodErrorResponse(validation.error.issues));
			const { description, title } = validation.data;

			// prisma
			const ticket = await ticketPrismaProvider.create({ userId: token.userId, description, title });

			// api
			return res.json(onSuccessResponse(ticket));
		} catch (error) {
			return errorLogger({ error, res, name: "tickets" });
		}
	}

	// add Message
	if (req.method === "PUT") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) return tokenFixer({ req, res });

			// validation
			const validation = zAddMessageTicket.safeParse(req.body);
			if (!validation.success) return res.json(onZodErrorResponse(validation.error.issues));
			const { description, ticketId } = validation.data;

			// prisma
			const owner = await ticketPrismaProvider.checkOwner(ticketId);
			if (owner?.userId !== token.userId) return res.json(onErrorResponse("ticket access denied."));

			const ticket = await ticketPrismaProvider.addMessage({ description, ticketId });

			// api
			return res.json(onSuccessResponse(ticket));
		} catch (error) {
			return errorLogger({ error, res, name: "tickets" });
		}
	}

	// get tickets
	if (req.method === "PATCH") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) return tokenFixer({ req, res });

			// validation
			const validation = zPagination.safeParse(req.body);
			if (!validation.success) return res.json(onZodErrorResponse(validation.error.issues));
			const { take, skip } = validation.data;

			// prisma
			const ticket = await ticketPrismaProvider.get({ skip, take, userId: token.userId });

			// api
			return res.json(onSuccessResponse(ticket));
		} catch (error) {
			return errorLogger({ error, res, name: "tickets" });
		}
	}

	// close ticket
	if (req.method === "DELETE") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) return tokenFixer({ req, res });

			// validation

			const id = parseInt(req.query.ticketId as string);
			if (!id) return res.json(onErrorResponse("bad ticket id"));

			// prisma
			const owner = await ticketPrismaProvider.checkOwner(id);
			if (owner?.userId !== token.userId) return res.json(onErrorResponse("ticket access denied."));

			const ticket = await ticketPrismaProvider.close(id);

			// api
			return res.json(onSuccessResponse(ticket));
		} catch (error) {
			return errorLogger({ error, res, name: "tickets" });
		}
	}

	// get one message
	if (req.method === "GET") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) return tokenFixer({ req, res });

			// validation

			const ticketId = parseInt(req.query.ticketId as string);
			if (!ticketId) return res.json(onErrorResponse("bad ticket id"));

			// prisma
			const owner = await ticketPrismaProvider.checkOwner(ticketId);

			console.log(owner, token.userId);

			if (owner?.userId !== token.userId) return res.json(onErrorResponse("ticket access denied."));

			const ticket = await ticketPrismaProvider.GetOne(ticketId);

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
