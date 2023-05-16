import { iCRUD } from "@models/iCRUD";
import prismaProvider from "@providers/prismaProvider";

// const lessonSelect = {
// 	Jobs: {
// 		select: {
// 			wageType: true,
// 			benefits: true,
// 			description: true,
// 			id: true,
// 			province: true,
// 			requirements: true,
// 			title: true,
// 			updatedAt: true,
// 			wage: true,
// 			courseId: true,
// 		},
// 	},
// };

const courseReturnFields = { id: true, title: true, description: true, category: true, updatedAt: true, createdAt: true, contentId: true };
type updateArgsType = { id: string; authorId: number; description?: string; title?: string; categoryId?: number; keywords?: string[] };

export default class CoursePrismaProvider implements iCRUD {
	async getSome(userId: number) {
		try {
			const courses = await prismaProvider.course.findMany({
				where: { authorId: userId },
				select: {
					id: true,
					title: true,
					description: true,
					category: true,
					updatedAt: true,
					createdAt: true,
					contentId: true,
					content: { select: { keyword: { select: { title: true } } } },
				},
			});

			return courses;
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}

	async getOne(id: number) {
		throw new Error("Method not implemented.");
	}
	// const  courses= {
	//     id: number;
	//     title: string;
	//     description: string;
	//     category: category;
	//     updatedAt: Date;
	//     createdAt: Date;
	//     contentId: string;
	//     content: {
	//         keyword: keyword[];
	//     };

	async create(body: { description: string; title: string; authorId: number; categoryId: number; keywords?: string[] }) {
		const { authorId, categoryId, description, title, keywords } = body;
		const keywordMapped = keywords?.map((keyword) => ({ where: { title: keyword }, create: { title: keyword, authorId } }));

		try {
			const course = await prismaProvider.content.create({
				data: {
					course: {
						create: {
							authorId,
							categoryId,
							description,
							title,
						},
					},
					keyword: { connectOrCreate: keywordMapped },
				},
				select: { course: { select: courseReturnFields }, keyword: { select: { title: true } } },
				// include: lessonSelect,
			});

			return { ...course.course, content: { keyword: course.keyword } };
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}

	async update({ id, authorId, description, title, categoryId, keywords }: updateArgsType) {
		try {
			const keywordMapped = keywords?.map((keyword) => ({ where: { title: keyword }, create: { title: keyword, authorId } }));

			const course = await prismaProvider.content.update({
				data: {
					course: {
						update: {
							categoryId,
							description,
							title,
						},
					},
					keyword: { connectOrCreate: keywordMapped, set: keywords?.map((key) => ({ title: key })) },
				},
				where: { id },
				select: { course: { select: courseReturnFields }, keyword: { select: { title: true } } },
				// TODO include: lessonSelect,
			});
			return { ...course.course, content: { keyword: course.keyword } };
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}

	async delete(id: number) {
		throw new Error("Method not implemented.");
	}

	async checkUniqueField({ title, contentId }: { title?: string; contentId?: string }) {
		try {
			const course = await prismaProvider.course.findFirst({
				where: {
					title: { equals: title },
					NOT: { contentId: { equals: contentId } },
				},
				select: { title: true, id: true },
			});
			return course;
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}

	async checkCourseAuthor({ contentId }: { contentId: string }) {
		try {
			const course = await prismaProvider.course.findFirst({
				where: { contentId },
				select: { authorId: true },
			});
			return course;
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}
}
