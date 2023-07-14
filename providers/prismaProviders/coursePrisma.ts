import prismaProvider from "@providers/prismaProvider";
import { prismaKeywordCreateHandler, prismaKeywordUpdateHandler } from "@utilities/keywordMapperPrisma";
import { lessonResType, lessonSelect } from "./lessonPrisma";
import { categoryResType } from "./categoryPrisma";
import { Category, Like } from "@prisma/client";

type updateArgsType = {
	courseId: number;
	authorId: number;
	description?: string;
	title?: string;
	categoryId?: number;
	keywords?: string[];
	context?: string;
};

export type coursePanelResType = {
	id: number;
	content: {
		id: number;
		title: string;
		description: string;
		context: string | null;
		image: string | null;
		createdAt: Date;
		updatedAt: Date;
		category: categoryResType;
		keywords: {
			title: string;
		}[];
	};
	lessons: lessonResType[];
};

export type coursePublicResType = {
	id: number;
	content: {
		id: number;
		title: string;
		description: string;
		context: string | null;
		createdAt: Date;
		updatedAt: Date;
		category: Category;
		image: string | null;
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
	lessons: lessonResType[];
};

export type courseImageRes = {
	content: {
		image: string | null;
	};
	id: number;
};

function publicCourseSelect({ userId }: { userId?: number }) {
	return {
		id: true,
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
				image: true,
				_count: {
					select: { likes: true },
				},
			},
		},
		lessons: { select: lessonSelect() },
	};
}

function coursePanelSelect() {
	return {
		id: true,
		content: {
			select: {
				id: true,
				title: true,
				description: true,
				context: true,
				image: true,
				category: true,
				updatedAt: true,
				createdAt: true,
				keywords: { select: { title: true } },
				_count: {
					select: { likes: true },
				},
			},
		},
		lessons: { select: lessonSelect() },
	};
}

export default class CoursePrismaProvider {
	// panel
	async getByAuthor(userId: number): Promise<coursePanelResType[]> {
		return await prismaProvider.course.findMany({
			where: { content: { authorId: userId } },
			select: coursePanelSelect(),
		});
	}

	async create(body: {
		description: string;
		title: string;
		authorId: number;
		categoryId: number;
		keywords?: string[];
		context?: string;
	}): Promise<coursePanelResType> {
		const { authorId, categoryId, description, title, keywords, context } = body;
		return await prismaProvider.course.create({
			data: {
				content: {
					create: {
						title,
						description,
						authorId,
						categoryId,
						context,
						keywords: prismaKeywordCreateHandler({ keywords, authorId }),
					},
				},
			},
			select: coursePanelSelect(),
		});
	}

	// : Promise<coursePanelResType>
	async update({ courseId, authorId, description, title, categoryId, keywords, context }: updateArgsType) {
		return await prismaProvider.course.update({
			where: { id: courseId },
			data: {
				content: {
					update: { description, title, categoryId, context, keywords: prismaKeywordUpdateHandler({ authorId, keywords }) },
				},
				// TODO ERR
				// lessons: { update: { data: { content: { update: { categoryId } } }, where: { courseId } } },
			},
			select: coursePanelSelect(),
		});
	}

	// public
	async getFeed({ userId }: { userId?: number }): Promise<coursePublicResType[]> {
		const feed = await prismaProvider.course.findMany({
			where: { content: { isActive: true } },
			select: publicCourseSelect({ userId }),
		});
		return feed;
	}

	async addImage({ courseId, imageName }: { courseId: number; imageName: string }): Promise<courseImageRes> {
		return await prismaProvider.course.update({
			where: { id: courseId },
			data: { content: { update: { image: imageName } } },
			select: { content: { select: { image: true } }, id: true },
		});
	}

	// internals
	async checkUniqueField({ title, courseId }: { title?: string; courseId?: number }) {
		return await prismaProvider.course.findFirst({
			where: { content: { title: { equals: title } }, NOT: { id: courseId } },
			select: { content: { select: { title: true } }, id: true },
		});
	}

	async checkCourseAuthor({ courseId }: { courseId: number }) {
		return await prismaProvider.course.findFirst({
			where: { id: courseId },
			select: { content: { select: { authorId: true } } },
		});
	}
}
