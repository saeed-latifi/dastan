import { Province } from "@prisma/client";
import prismaProvider from "@providers/prismaProvider";

export default class ProvincePrismaProvider {
	async getSome(): Promise<Province[]> {
		return await prismaProvider.province.findMany();
	}
}
