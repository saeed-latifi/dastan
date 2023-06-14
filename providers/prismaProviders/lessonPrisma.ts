import { iLessonCreate, iLessonUpdate } from "@models/iLesson";
import prismaProvider from "@providers/prismaProvider";
import { prismaKeywordCreateHandler, prismaKeywordUpdateHandler } from "@utilities/keywordMapperPrisma";
import { Category, Like } from "@prisma/client";

export type lessonPanelResType = {
	id: number;
	videoUrl: string;
	courseId: number;
	content: {
		id: number;
		title: string;
		description: string;
		context: string | null;
		createdAt: Date;
		updatedAt: Date;
		category: Category;
		_count: {
			likes: number;
		};
		keywords: {
			title: string;
		}[];
	};
};

export type lessonPublicResType = {
	id: number;
	content: {
		id: number;
		title: string;
		description: string;
		context: string | null;
		createdAt: Date;
		updatedAt: Date;
		category: Category;
		author: {
			id: number;
			username: string;
		};
		_count: {
			likes: number;
		};
		likes: Like[];
		keywords: {
			title: string;
		}[];
	};
	videoUrl: string;
	courseId: number;
};

export function lessonPanelSelect() {
	return {
		id: true,
		videoUrl: true,
		courseId: true,
		content: {
			select: {
				id: true,
				title: true,
				description: true,
				context: true,
				category: true,
				updatedAt: true,
				createdAt: true,
				keywords: { select: { title: true } },
				_count: {
					select: { likes: true },
				},
			},
		},
	};
}

export function lessonPublicSelect({ userId }: { userId?: number }) {
	return {
		id: true,
		videoUrl: true,
		courseId: true,
		content: {
			select: {
				id: true,
				title: true,
				description: true,
				context: true,
				category: true,
				updatedAt: true,
				createdAt: true,
				keywords: { select: { title: true } },
				author: { select: { username: true, id: true } },
				likes: { where: { authorId: userId } },
				_count: {
					select: { likes: true },
				},
			},
		},
	};
}

export default class LessonPrismaProvider {
	// public
	async getSome({ courseId, userId }: { courseId: number; userId?: number }): Promise<lessonPublicResType[]> {
		return await prismaProvider.lesson.findMany({ where: { courseId }, select: lessonPublicSelect({ userId }) });
	}

	// panel
	async create({ body, authorId }: { body: iLessonCreate; authorId: number }): Promise<lessonPanelResType> {
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

			select: lessonPanelSelect(),
		});
	}

	async update({ body, authorId }: { body: iLessonUpdate; authorId: number }): Promise<lessonPanelResType> {
		const { title, description, videoUrl, id, keywords, categoryId } = body;
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

			select: lessonPanelSelect(),
			where: { id },
		});
	}

	// internals
	async checkUniqueField({ title, lessonId }: { title?: string; lessonId?: number }) {
		return await prismaProvider.lesson.findFirst({
			where: { content: { title: { equals: title } }, NOT: { id: lessonId } },
			select: { content: { select: { title: true } }, id: true },
		});
	}

	async checkLessonAuthor({ lessonId }: { lessonId: number }) {
		return await prismaProvider.lesson.findFirst({
			where: { id: lessonId },
			select: { content: { select: { authorId: true } } },
		});
	}
}
