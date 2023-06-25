import { iCommentCreate, iCommentUpdate } from "@models/iComment";
import prismaProvider from "@providers/prismaProvider";

export type commentResType = {
	id: number;
	contentId: number;
	description: string;
	createdAt: Date;
	updatedAt: Date;
	parentId: number | null;
	replyId: number | null;
	author: { id: number; username: string };
	reply?: { author: { username: string; id: number } } | null;
	children?: commentResType[];
	_count?: { children: number };
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
			select: { ...commentSelect, _count: { select: { children: true } } },
		});
		return comments;
	}

	async getByParentId({ parentId }: { parentId: number }): Promise<commentResType[]> {
		const comments = await prismaProvider.comment.findMany({
			where: { isActive: true, parentId },
			select: { ...commentSelect, reply: { select: { author: { select: { username: true, id: true } } } } },
		});
		return comments;
	}

	async create({ body, authorId }: { body: iCommentCreate; authorId: number }): Promise<commentResType> {
		const { description, parentId, replyId, contentId } = body;
		const comment = await prismaProvider.comment.create({
			data: { authorId, description, contentId, parentId, replyId },
			select: { ...commentSelect, reply: { select: { author: { select: { username: true, id: true } } } } },
		});
		return comment;
	}

	async update({ description, id }: iCommentUpdate): Promise<commentResType> {
		const comment = await prismaProvider.comment.update({ where: { id }, select: commentSelect, data: { description } });
		return comment;
	}

	async delete({ id }: { id: number }): Promise<commentResType> {
		// 	// TODO fix on "disconnect" child _count
		// const comment = await prismaProvider.comment.update({
		// 	where: { id },
		// 	select: commentSelect,
		// 	data: { isActive: false },
		// });

		const comment = await prismaProvider.comment.delete({ where: { id }, select: commentSelect });
		return comment;
	}

	// internal
	async checkAuthor({ id }: { id: number }) {
		const comment = await prismaProvider.comment.findFirst({ where: { id }, select: { authorId: true, id: true } });
		return comment;
	}
}
