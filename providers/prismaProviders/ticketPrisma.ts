import prismaProvider from "@providers/prismaProvider";

export type ticketResType = { id: number; title: string; isActive: boolean; userId: number };
export default class JobPrismaProvider {
	// panel
	async get({ userId, skip, take }: { userId: number; take: number; skip: number }): Promise<ticketResType[]> {
		return await prismaProvider.ticket.findMany({ where: { userId, isActive: true }, take, skip });
	}

	async create({ description, title, userId }: { title: string; userId: number; description: string }) {
		return await prismaProvider.ticket.create({ data: { title, userId, messages: { create: { description } } } });
	}

	async answer({ id, description }: { id: number; description: string }) {
		return await prismaProvider.ticket.update({ where: { id }, data: { messages: { create: { description, isAdmin: true } } } });
	}

	async addMessage({ id, description }: { id: number; description: string }) {
		return await prismaProvider.ticket.update({ where: { id }, data: { messages: { create: { description } } } });
	}

	async close(id: number) {
		return await prismaProvider.ticket.update({ where: { id }, data: { isActive: false } });
	}

	// admin
	async getForAdmin({ userId, isActive, take, skip }: { userId?: number; isActive?: boolean; take: number; skip: number }): Promise<ticketResType[]> {
		return await prismaProvider.ticket.findMany({ where: { userId, isActive }, take, skip });
	}
}
