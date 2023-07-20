import prismaProvider from "@providers/prismaProvider";

export type ticketMessageType = { id: number; description: string; isAdmin: boolean; ticketId: number };
export type ticketResType = { id: number; title: string; isActive: boolean; userId: number; messages: ticketMessageType[] };
export default class TicketPrismaProvider {
	// panel
	async get({ userId, skip, take }: { userId: number; take: number; skip: number }): Promise<ticketResType[]> {
		return await prismaProvider.ticket.findMany({ where: { userId, isActive: true }, include: { messages: true }, take, skip });
	}

	async create({ description, title, userId }: { title: string; userId: number; description: string }): Promise<ticketResType> {
		return await prismaProvider.ticket.create({ data: { title, userId, messages: { create: { description } } }, include: { messages: true } });
	}

	async addMessage({ id, description }: { id: number; description: string }): Promise<ticketResType> {
		return await prismaProvider.ticket.update({ where: { id }, data: { messages: { create: { description } } }, include: { messages: true } });
	}

	async close(id: number) {
		return await prismaProvider.ticket.update({ where: { id }, data: { isActive: false } });
	}

	// internal
	async checkOwner(id: number) {
		return await prismaProvider.ticket.findFirst({ where: { id }, select: { userId: true } });
	}

	// admin
	async getForAdmin({ userId, isActive, take, skip }: { userId?: number; isActive?: boolean; take: number; skip: number }): Promise<ticketResType[]> {
		return await prismaProvider.ticket.findMany({ where: { userId, isActive }, take, skip, include: { messages: true } });
	}

	async answer({ id, description }: { id: number; description: string }): Promise<ticketResType> {
		return await prismaProvider.ticket.update({ where: { id }, data: { messages: { create: { description, isAdmin: true } } }, include: { messages: true } });
	}
}
