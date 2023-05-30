import { Category } from "@prisma/client";
import prismaProvider from "@providers/prismaProvider";

export type categoryResType = { id: number; title: string };

export default class CategoryPrismaProvider {
	async getSome(): Promise<Category[]> {
		return await prismaProvider.category.findMany();
	}
}
