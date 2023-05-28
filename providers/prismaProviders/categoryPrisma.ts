import prismaProvider from "@providers/prismaProvider";

export type categoryResType = { id: number; title: string };

export default class CategoryPrismaProvider {
	async getSome() {
		try {
			const Categories: categoryResType[] = await prismaProvider.category.findMany();
			return Categories;
		} catch (error) {
			return "ERR";
		}
	}
}
