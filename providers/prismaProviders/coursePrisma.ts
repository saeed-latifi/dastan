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

const courseReturnFields = { id: true, author: true, category: true, description: true, keywords: true, title: true, updatedAt: true };

export default class CoursePrismaProvider implements iCRUD {
	async getSome(userId: number) {
		try {
			const courses = await prismaProvider.course.findMany({
				where: { authorId: userId },
				// include: lessonSelect,
				select: courseReturnFields,
			});
			return courses;
		} catch (error) {
			return "ERR";
		}
	}

	async getOne(id: number) {
		throw new Error("Method not implemented.");
	}

	// TODO keywords
	async create(body: { description: string; title: string; authorId: number; categoryId: number }) {
		try {
			const course = await prismaProvider.course.create({
				data: body,
				// include: lessonSelect,
			});
			return course;
		} catch (error) {
			return "ERR";
		}
	}

	// TODO keywords
	async update(id: number, body: { description?: string; title?: string; categoryId?: number }) {
		try {
			const course = await prismaProvider.course.update({
				data: body,
				where: { id },
				// include: lessonSelect,
			});
			return course;
		} catch (error) {
			return "ERR";
		}
	}

	async delete(id: number) {
		throw new Error("Method not implemented.");
	}

	async checkUniqueField({ title, courseId }: { title?: string; courseId?: number }) {
		try {
			const course = await prismaProvider.course.findFirst({
				where: {
					title: { equals: title },
					NOT: { id: { equals: courseId } },
				},
				select: { title: true, id: true },
			});
			return course;
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}

	async checkCourseAuthor({ courseId }: { courseId: number }) {
		try {
			const course = await prismaProvider.course.findFirst({
				where: { id: courseId },
				select: { authorId: true },
			});
			return course;
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}
}
