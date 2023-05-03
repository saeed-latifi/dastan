import { iCRUD } from "@models/iCRUD";
import prismaProvider from "@providers/prismaProvider";

const provincesSeed = [
	{ id: 1, title: "آذربایجان شرقی" },
	{ id: 2, title: "آذربایجان غربی" },
	{ id: 3, title: "اردبیل " },
	{ id: 4, title: "اصفهان " },
	{ id: 5, title: "البرز " },
	{ id: 6, title: "ایلام " },
	{ id: 7, title: "بوشهر " },
	{ id: 8, title: "تهران " },
	{ id: 9, title: "چهارمحال و بختیاری" },
	{ id: 10, title: "خراسان جنوبی" },
	{ id: 11, title: "خراسان رضوی" },
	{ id: 12, title: "خراسان شمالی" },
	{ id: 13, title: "خوزستان" },
	{ id: 14, title: "زنجان " },
	{ id: 15, title: "سمنان " },
	{ id: 16, title: "سیستان و بلوچستان" },
	{ id: 17, title: "فارس " },
	{ id: 18, title: "قزوین " },
	{ id: 19, title: "قم " },
	{ id: 20, title: "کردستان " },
	{ id: 21, title: "کرمان " },
	{ id: 22, title: "کرمانشاه " },
	{ id: 23, title: "کهگیلویه و بویراحمد" },
	{ id: 24, title: "گلستان " },
	{ id: 25, title: "گیلان " },
	{ id: 26, title: "لرستان " },
	{ id: 27, title: "مازندران " },
	{ id: 28, title: "مرکزی " },
	{ id: 29, title: "هرمزگان " },
	{ id: 30, title: "همدان " },
	{ id: 31, title: "یزد " },
];

export default class ProvincePrismaProvider implements iCRUD {
	async getSome() {
		try {
			const provinces = await prismaProvider.province.findMany();
			return provinces;
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

	async seed() {
		try {
			const provinces = await prismaProvider.province.createMany({ data: provincesSeed, skipDuplicates: true });
			return provinces;
		} catch (error) {
			return "ERR";
		}
	}
}
