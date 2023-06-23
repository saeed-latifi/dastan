import { iCommentCreate } from "@models/iComment";
import prismaProvider from "@providers/prismaProvider";

export type commentResType = {
	contentId: number;
	createdAt: Date;
	description: string;
	id: number;
	updatedAt: Date;
	parentId: number | null;
	replyId: number | null;
	author: {
		id: number;
		username: string;
	};
};

const commentSelect = {
	author: { select: { id: true, username: true } },
	id: true,
	contentId: true,
	description: true,
	createdAt: true,
	updatedAt: true,
	parentId: true,
	replyId: true,
};

export default class CommentPrismaProvider {
	async getByContentId({ contentId }: { contentId: number }): Promise<commentResType[]> {
		const comments = await prismaProvider.comment.findMany({
			where: { contentId, isActive: true, parentId: null },
			select: commentSelect,
		});
		return comments;
	}

	async create({ body, authorId }: { body: iCommentCreate; authorId: number }): Promise<commentResType> {
		const { description, parentId, replyId, contentId } = body;
		const comment = await prismaProvider.comment.create({
			data: { authorId, description, contentId, parentId, replyId },
			select: commentSelect,
		});
		return comment;
	}

	async delete({ id }: { id: number }) {
		const comment = await prismaProvider.comment.update({
			where: { id },
			select: commentSelect,
			data: { isActive: false },
		});
		return comment;
	}

	// internal
	async checkAuthor({ id }: { id: number }) {
		const comment = await prismaProvider.comment.findFirst({
			where: { id },
			select: { authorId: true, id: true },
		});
		return comment;
	}
}
