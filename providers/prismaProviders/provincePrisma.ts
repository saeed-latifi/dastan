import prismaProvider from "@providers/prismaProvider";

export type provinceResType = { id: number; title: string };

export default class ProvincePrismaProvider {
	async getSome() {
		try {
			const provinces: provinceResType[] = await prismaProvider.province.findMany();
			return provinces;
		} catch (error) {
			return "ERR";
		}
	}
}
