import prismaProvider from "@providers/prismaProvider";

export type AdminMessageResType = {
	user: { id: number; username: string };
	id: number;
	title: string;
	description: string;
	isRead: boolean;
	isActive: boolean;
	createdAt: Date;
};

const includeUser = { user: { select: { id: true, username: true } } };

export default class AdminMessagesPrismaProvider {
	// panel
	async get({ userId, skip, take }: { userId: number; take: number; skip: number }): Promise<{ messages: AdminMessageResType[]; count: number }> {
		const count = await prismaProvider.adminMessage.count({ where: { userId, isActive: true } });
		const messages = await prismaProvider.adminMessage.findMany({
			where: { userId, isActive: true },
			take,
			skip,
			include: includeUser,
			orderBy: { createdAt: "desc" },
		});
		return { messages, count };
	}

	async view(id: number): Promise<AdminMessageResType> {
		return await prismaProvider.adminMessage.update({ where: { id }, data: { isRead: true }, include: includeUser });
	}

	async delete(id: number): Promise<AdminMessageResType> {
		return await prismaProvider.adminMessage.update({ where: { id }, data: { isActive: false }, include: includeUser });
	}

	// admin
	async add({ description, userId, title }: { userId: number; description: string; title: string }): Promise<AdminMessageResType> {
		return await prismaProvider.adminMessage.create({ data: { userId, description, title }, include: includeUser });
	}

	async update({ description, messageId, title }: { messageId: number; description: string; title: string }): Promise<AdminMessageResType> {
		return await prismaProvider.adminMessage.update({ where: { id: messageId }, data: { description, title }, include: includeUser });
	}

	async getAdminMessageList({ isActive, skip, take }: getListArgsType): Promise<{ messages: AdminMessageResType[]; count: number }> {
		const count = await prismaProvider.adminMessage.count({ where: { isActive } });
		const messages = await prismaProvider.adminMessage.findMany({ take, skip, where: { isActive }, include: includeUser, orderBy: { createdAt: "desc" } });
		return { messages, count };
	}
}
type getListArgsType = { take: number; skip: number; isActive?: boolean };
