import prismaProvider from "@providers/prismaProvider";

export type adminMessageResType = { id: number; title: string; description: string; isRead: boolean; isActive: boolean; createdAt: Date; userId: number };
export default class AdminMessagesPrismaProvider {
	// panel
	async get({ userId, skip, take }: { userId: number; take: number; skip: number }): Promise<adminMessageResType[]> {
		return await prismaProvider.adminMessage.findMany({ where: { userId, isActive: true }, take, skip });
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
}
