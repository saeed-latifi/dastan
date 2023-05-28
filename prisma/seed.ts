const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const categoriesSeed = [
	{ id: 1, title: "Animate" },
	{ id: 2, title: "Game Design" },
	{ id: 3, title: "Character Design" },
	{ id: 4, title: "Environment Design" },
	{ id: 5, title: "Programming" },
	{ id: 6, title: "Game Engine" },
	{ id: 7, title: "Web" },
	{ id: 8, title: "3D Modeling" },
	{ id: 9, title: "Texturing" },
	{ id: 10, title: "UI UX Design" },
	{ id: 11, title: "Sound and Music" },
	{ id: 12, title: "Narrative" },
];

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

async function seed() {
	const categories = await prisma.category.createMany({ data: categoriesSeed, skipDuplicates: true });
	console.log("categories : ", categories);
	const provinces = await prisma.province.createMany({ data: provincesSeed, skipDuplicates: true });
	console.log(provinces);
}

seed();
