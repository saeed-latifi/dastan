import prismaProvider from "@providers/prismaProvider";

export type provinceResType = { id: number; title: string };

export default class ProvincePrismaProvider {
	async getSome() {
		const provinces: provinceResType[] = await prismaProvider.province.findMany();
		return provinces;
	}
}
