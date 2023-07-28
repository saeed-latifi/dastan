import prismaProvider from "@providers/prismaProvider";

export type adminMessageResType = { id: number; title: string; description: string; isRead: boolean; isActive: boolean; createdAt: Date; userId: number };
export default class AdminMessagesPrismaProvider {
	// panel
	async get({ userId, skip, take }: { userId: number; take: number; skip: number }): Promise<{ messages: adminMessageResType[]; count: number }> {
		const count = await prismaProvider.adminMessage.count({ where: { userId, isActive: true } });
		const messages = await prismaProvider.adminMessage.findMany({ where: { userId, isActive: true }, take, skip });
		return { messages, count };
	}

	async view(id: number): Promise<adminMessageResType> {
		return await prismaProvider.adminMessage.update({ where: { id }, data: { isRead: true } });
	}

	async delete(id: number): Promise<adminMessageResType> {
		return await prismaProvider.adminMessage.update({ where: { id }, data: { isActive: false } });
	}

	// admin
	async add({ description, userId, title }: { userId: number; description: string; title: string }): Promise<adminMessageResType> {
		return await prismaProvider.adminMessage.create({ data: { userId, description, title } });
	}

	async getAdminList({ isActive, skip, take }: { take: number; skip: number; isActive?: boolean }): Promise<{ messages: AdminMessagesResType[]; count: number }> {
		const count = await prismaProvider.adminMessage.count({ where: { isActive } });
		const messages = await prismaProvider.adminMessage.findMany({
			take,
			skip,
			where: { isActive },
			include: { user: { select: { id: true, username: true } } },
		});
		return { messages, count };
	}
}

export type AdminMessagesResType = {
	user: { id: number; username: string };
	id: number;
	title: string;
	description: string;
	isRead: boolean;
	isActive: boolean;
	createdAt: Date;
	userId: number;
};
