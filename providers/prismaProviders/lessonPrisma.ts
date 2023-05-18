import { iCRUD } from "@models/iCRUD";
import { iLessonCreate, iLessonUpdate } from "@models/iLesson";
import prismaProvider from "@providers/prismaProvider";
import { prismaKeywordCreateHandler, prismaKeywordUpdateHandler } from "@utilities/keywordMapperPrisma";

export const lessonReturnFields = {
	select: {
		attachments: true,
		contentId: true,
		description: true,
		title: true,
		videoUrl: true,
		updatedAt: true,
		createdAt: true,
		id: true,
		courseId: true,
		content: { select: { keyword: { select: { title: true } } } },
	},
};
export default class LessonPrismaProvider implements iCRUD {
	async create({ body, authorId }: { body: iLessonCreate; authorId: number }) {
		const { title, description, videoUrl, courseId, keywords, attachments } = body;

		try {
			const content = await prismaProvider.content.create({
				data: {
					lesson: { create: { title, description, videoUrl, courseId, attachments } },
					keyword: prismaKeywordCreateHandler({ authorId, keywords }),
				},
				select: { lesson: lessonReturnFields },
			});

			return content.lesson;
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}
	async update({ body, authorId }: { body: iLessonUpdate; authorId: number }) {
		try {
			const { title, description, videoUrl, contentId, keywords, attachments } = body;
			const content = await prismaProvider.content.update({
				data: {
					lesson: { update: { title, videoUrl, description, attachments } },
					keyword: prismaKeywordUpdateHandler({ authorId, keywords }),
				},
				where: { id: contentId },
				select: { lesson: lessonReturnFields },
			});
			return content.lesson;
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}

	async checkUniqueField({ title, contentId }: { title?: string; contentId?: string }) {
		try {
			const lesson = await prismaProvider.lesson.findFirst({
				where: {
					title: { equals: title },
					NOT: { contentId: { equals: contentId } },
				},
				select: { title: true, contentId: true },
			});
			return lesson;
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}

	async checkLessonAuthor({ contentId }: { contentId: string }) {
		try {
			const lesson = await prismaProvider.lesson.findFirst({
				where: { contentId },
				select: { course: { select: { authorId: true } } },
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
