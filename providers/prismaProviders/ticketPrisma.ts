import { resWithPaginationType } from "@providers/apiResponseHandler";
import prismaProvider from "@providers/prismaProvider";

export type ticketMessageType = { id: number; description: string; isAdmin: boolean; ticketId: number };
export type ticketResType = { id: number; title: string; isActive: boolean; userId: number; messages: ticketMessageType[] };

export default class TicketPrismaProvider {
	// panel
	async get({ userId, skip, take }: { userId: number; take: number; skip: number }): Promise<resWithPaginationType<ticketResType>> {
		const count = await prismaProvider.ticket.count({ where: { userId, isActive: true } });
		const items = await prismaProvider.ticket.findMany({
			where: { userId, isActive: true },
			include: { messages: true },
			take,
			skip,
			orderBy: { id: "desc" },
		});
		return { count, items };
	}

	async GetOne(id: number): Promise<ticketResType | null> {
		return await prismaProvider.ticket.findUnique({ where: { id }, include: { messages: { orderBy: { id: "desc" } } } });
	}

	async create({ description, title, userId }: { title: string; userId: number; description: string }): Promise<ticketResType> {
		return await prismaProvider.ticket.create({ data: { title, userId, messages: { create: { description } } }, include: { messages: true } });
	}

	async addMessage({ ticketId, description }: { ticketId: number; description: string }): Promise<ticketMessageType> {
		return await prismaProvider.ticketMessage.create({ data: { description, ticketId } });
	}

	async close(id: number) {
		return await prismaProvider.ticket.update({ where: { id }, data: { isActive: false } });
	}

	// internal
	async checkOwner(id: number) {
		return await prismaProvider.ticket.findFirst({ where: { id }, select: { userId: true } });
	}

	// admin
	async getForAdmin({
		userId,
		isActive,
		take,
		skip,
	}: {
		userId?: number;
		isActive?: boolean;
		take: number;
		skip: number;
	}): Promise<resWithPaginationType<ticketResType>> {
		const count = await prismaProvider.ticket.count({ where: { userId, isActive: true } });
		const items = await prismaProvider.ticket.findMany({ where: { userId, isActive }, take, skip, include: { messages: true }, orderBy: { id: "desc" } });
		return { count, items };
	}

	async answer({ ticketId, description }: { ticketId: number; description: string }): Promise<ticketMessageType> {
		return await prismaProvider.ticketMessage.create({ data: { description, ticketId, isAdmin: true } });
	}
}
