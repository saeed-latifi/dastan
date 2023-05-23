import { iCRUD } from "@models/iCRUD";
import { iLessonCreate, iLessonUpdate } from "@models/iLesson";
import prismaProvider from "@providers/prismaProvider";
import { prismaKeywordCreateHandler, prismaKeywordUpdateHandler } from "@utilities/keywordMapperPrisma";

export default class LessonPrismaProvider implements iCRUD {
	async create({ body, authorId }: { body: iLessonCreate; authorId: number }) {
		const { title, description, videoUrl, courseId, keywords, categoryId } = body;

		try {
			const content = await prismaProvider.lesson.create({
				data: {
					content: {
						create: {
							title,
							description,
							authorId,
							categoryId,
							keywords: prismaKeywordCreateHandler({ keywords, authorId }),
						},
					},
					videoUrl,
					course: { connect: { id: courseId } },
				},

				select: lessonSelectShape(),
			});

			return content;
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}
	async update({ body, authorId }: { body: iLessonUpdate; authorId: number }) {
		try {
			const { title, description, videoUrl, contentId, keywords, categoryId } = body;
			const content = await prismaProvider.lesson.update({
				data: {
					content: {
						update: {
							title,
							description,
							categoryId,
							keywords: prismaKeywordUpdateHandler({ keywords, authorId }),
						},
					},
					videoUrl,
				},

				select: lessonSelectShape(),
				where: { contentId },
			});
			return content;
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}

	async checkUniqueField({ title, contentId }: { title?: string; contentId?: number }) {
		try {
			const lesson = await prismaProvider.lesson.findFirst({
				where: {
					content: { title: { equals: title } },
					NOT: { contentId },
				},

				select: { content: { select: { title: true } }, contentId: true },
			});
			return lesson;
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}

	async checkLessonAuthor({ contentId }: { contentId: number }) {
		try {
			const lesson = await prismaProvider.lesson.findFirst({
				where: { contentId },
				select: { content: { select: { authorId: true } } },
			});
			return lesson;
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}

	getSome(...body: any) {
		throw new Error("Method not implemented.");
	}

	getOne(...body: any) {
		throw new Error("Method not implemented.");
	}

	delete(...body: any) {
		throw new Error("Method not implemented.");
	}
}

export function lessonSelectShape() {
	return {
		videoUrl: true,
		courseId: true,
		content: { select: { id: true, title: true, description: true, category: true, updatedAt: true, createdAt: true } },
	};
}
