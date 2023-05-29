import prismaProvider from "@providers/prismaProvider";
import { prismaKeywordCreateHandler, prismaKeywordUpdateHandler } from "@utilities/keywordMapperPrisma";
import { lessonSelectShape } from "./lessonPrisma";
import { categoryResType } from "./categoryPrisma";

type updateArgsType = { contentId: number; authorId: number; description?: string; title?: string; categoryId?: number; keywords?: string[] };
type lessonResType = {
	videoUrl: string;
	courseId: number;
	content: {
		id: number;
		title: string;
		description: string;
		createdAt: Date;
		updatedAt: Date;
		category: categoryResType;
	};
};

type courseResType = {
	content: {
		id: number;
		title: string;
		description: string;
		createdAt: Date;
		updatedAt: Date;
		category: categoryResType;
		keywords: {
			title: string;
		}[];
	};
	lessons: lessonResType[];
};

export default class CoursePrismaProvider {
	async getByAuthor(userId: number) {
		return await prismaProvider.course.findMany({
			where: { content: { authorId: userId } },
			select: courseSelectShape(),
		});
	}

	async create(body: { description: string; title: string; authorId: number; categoryId: number; keywords?: string[] }) {
		const { authorId, categoryId, description, title, keywords } = body;
		return await prismaProvider.course.create({
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
			},
			select: courseSelectShape(),
		});
	}

	async update({ contentId, authorId, description, title, categoryId, keywords }: updateArgsType) {
		return await prismaProvider.course.update({
			where: { contentId },
			data: { content: { update: { description, title, categoryId, keywords: prismaKeywordUpdateHandler({ authorId, keywords }) } } },
			select: courseSelectShape(),
		});
	}

	async checkUniqueField({ title, contentId }: { title?: string; contentId?: number }) {
		return await prismaProvider.course.findFirst({
			where: { content: { title: { equals: title } }, NOT: { contentId } },
			select: { content: { select: { title: true } }, contentId: true },
		});
	}

	async checkCourseAuthor({ contentId }: { contentId: number }) {
		return await prismaProvider.course.findFirst({
			where: { contentId },
			select: { content: { select: { authorId: true } } },
		});
	}

	async getSome({ userId }: { userId?: number }) {
		return await prismaProvider.course.findMany({
			where: { content: { isActive: true } },
			select: publicCourseSelect({ userId }),
		});
	}
}

function publicCourseSelect({ userId }: { userId?: number }) {
	return {
		content: {
			select: {
				title: true,
				description: true,
				category: true,
				updatedAt: true,
				createdAt: true,
				author: { select: { username: true, id: true, slug: true } },
				keywords: { select: { title: true } },
				likes: { where: { authorId: userId } },
				_count: {
					select: { likes: true },
				},
				comments: {
					select: {
						author: { select: { username: true, id: true, slug: true } },
						id: true,
						description: true,
						createdAt: true,
						updatedAt: true,
					},
				},
			},
		},
		lessons: { select: lessonSelectShape() },
	};
}

function courseSelectShape() {
	return {
		content: {
			select: {
				id: true,
				title: true,
				description: true,
				category: true,
				updatedAt: true,
				createdAt: true,
				keywords: { select: { title: true } },
			},
		},
		lessons: { select: lessonSelectShape() },
	};
}
