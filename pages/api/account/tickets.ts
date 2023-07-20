import { zPagination } from "@models/iPagination";
import { zAddMessageTicket, zCreateTicket } from "@models/iTicket";
import { onErrorResponse, onSuccessResponse, onZodErrorResponse } from "@providers/apiResponseHandler";
import TicketPrismaProvider from "@providers/prismaProviders/ticketPrisma";
import { tokenFixer, tokenValidator } from "@providers/tokenProvider";
import { errorLogger } from "@utilities/apiLogger";
import { NextApiRequest, NextApiResponse } from "next";

const ticketPrismaProvider = new TicketPrismaProvider();
export default async function changeEmailApi(req: NextApiRequest, res: NextApiResponse) {
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
			return errorLogger({ error, res, name: "email" });
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
			const { description, id } = validation.data;

			// prisma
			const owner = await ticketPrismaProvider.checkOwner(id);
			if (owner?.userId === token.userId) return res.json(onErrorResponse("ticket access denied."));

			const ticket = await ticketPrismaProvider.addMessage({ description, id });

			// api
			return res.json(onSuccessResponse(ticket));
		} catch (error) {
			return errorLogger({ error, res, name: "email" });
		}
	}

	// get Message
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
			return errorLogger({ error, res, name: "email" });
		}
	}

	// get Message
	if (req.method === "DELETE") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) return tokenFixer({ req, res });

			// validation

			const id = parseInt(req.query.id as string);
			if (!id) return res.json(onErrorResponse("bad ticket id"));

			// prisma
			const owner = await ticketPrismaProvider.checkOwner(id);
			if (owner?.userId === token.userId) return res.json(onErrorResponse("ticket access denied."));

			const ticket = await ticketPrismaProvider.close(id);

			// api
			return res.json(onSuccessResponse(ticket));
		} catch (error) {
			return errorLogger({ error, res, name: "email" });
		}
	}

	// not supported
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
