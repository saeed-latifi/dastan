import { iCRUD } from "@models/iCRUD";
import prismaProvider from "@providers/prismaProvider";
import { prismaKeywordCreateHandler, prismaKeywordUpdateHandler } from "@utilities/keywordMapperPrisma";
import { lessonReturnFields } from "./lessonPrisma";

const courseReturnFields = {
	id: true,
	title: true,
	description: true,
	category: true,
	updatedAt: true,
	createdAt: true,
	contentId: true,
	lesson: lessonReturnFields,
};
type updateArgsType = { contentId: string; authorId: number; description?: string; title?: string; categoryId?: number; keywords?: string[] };

export default class CoursePrismaProvider implements iCRUD {
	async getByAuthor(userId: number) {
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
					lesson: lessonReturnFields,
				},
			});

			return courses;
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}

	async create(body: { description: string; title: string; authorId: number; categoryId: number; keywords?: string[] }) {
		const { authorId, categoryId, description, title, keywords } = body;

		try {
			const content = await prismaProvider.content.create({
				data: {
					course: { create: { authorId, categoryId, description, title } },
					keyword: prismaKeywordCreateHandler({ authorId, keywords }),
				},
				select: { course: { select: courseReturnFields }, keyword: { select: { title: true } } },
			});

			return { ...content.course, content: { keyword: content.keyword } };
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}

	async update({ contentId, authorId, description, title, categoryId, keywords }: updateArgsType) {
		try {
			const content = await prismaProvider.content.update({
				data: {
					course: { update: { categoryId, description, title } },
					keyword: prismaKeywordUpdateHandler({ authorId, keywords }),
				},
				where: { id: contentId },
				select: { course: { select: courseReturnFields }, keyword: { select: { title: true } } },
			});
			return { ...content.course, content: { keyword: content.keyword } };
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}

	async checkUniqueField({ title, contentId }: { title?: string; contentId?: string }) {
		try {
			const course = await prismaProvider.course.findFirst({
				where: {
					title: { equals: title },
					NOT: { contentId: { equals: contentId } },
				},
				select: { title: true, contentId: true },
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

	async getSome({ userId }: { userId?: number }) {
		try {
			const courses = await prismaProvider.content.findMany({
				select: {
					_count: { select: { like: true } },
					like: { where: { authorId: userId }, select: { state: true } },
					course: { select: courseReturnFields },
					keyword: { select: { title: true } },
					comment: { select: { authorId: true, id: true, description: true, createdAt: true, updatedAt: true } },
				},
				where: { course: { isActive: true } },
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
	async delete(id: number) {
		throw new Error("Method not implemented.");
	}
}
