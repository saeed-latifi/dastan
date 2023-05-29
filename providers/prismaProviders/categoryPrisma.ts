import prismaProvider from "@providers/prismaProvider";

export type categoryResType = { id: number; title: string };

export default class CategoryPrismaProvider {
	async getSome() {
		return await prismaProvider.category.findMany();
	}
}
