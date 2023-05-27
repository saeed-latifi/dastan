import { iCRUD } from "@models/iCRUD";
import prismaProvider from "@providers/prismaProvider";

export default class CategoryPrismaProvider implements iCRUD {
	async getSome() {
		try {
			const Categories = await prismaProvider.category.findMany();
			return Categories;
		} catch (error) {
			return "ERR";
		}
	}
	async getOne(id: number) {
		throw new Error("Method not implemented.");
	}
	async create(body: any) {
		throw new Error("Method not implemented.");
	}
	async update(id: number, body: any) {
		throw new Error("Method not implemented.");
	}
	async delete(id: number) {
		throw new Error("Method not implemented.");
	}
}
