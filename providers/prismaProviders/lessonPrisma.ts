import { iLessonCreate, iLessonUpdate } from "@models/iLesson";
import prismaProvider from "@providers/prismaProvider";
import { prismaKeywordCreateHandler, prismaKeywordUpdateHandler } from "@utilities/keywordMapperPrisma";

export default class LessonPrismaProvider {
	async create({ body, authorId }: { body: iLessonCreate; authorId: number }) {
		const { title, description, videoUrl, courseId, keywords, categoryId } = body;

		return await prismaProvider.lesson.create({
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
	}
	async update({ body, authorId }: { body: iLessonUpdate; authorId: number }) {
		const { title, description, videoUrl, contentId, keywords, categoryId } = body;
		return await prismaProvider.lesson.update({
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
	}

	async checkUniqueField({ title, contentId }: { title?: string; contentId?: number }) {
		return await prismaProvider.lesson.findFirst({
			where: { content: { title: { equals: title } }, NOT: { contentId } },
			select: { content: { select: { title: true } }, contentId: true },
		});
	}

	async checkLessonAuthor({ contentId }: { contentId: number }) {
		return await prismaProvider.lesson.findFirst({
			where: { contentId },
			select: { content: { select: { authorId: true } } },
		});
	}
}

export function lessonSelectShape() {
	return {
		videoUrl: true,
		courseId: true,
		content: { select: { id: true, title: true, description: true, category: true, updatedAt: true, createdAt: true } },
	};
}
