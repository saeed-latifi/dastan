import { Content, Like } from "@prisma/client";
import prismaProvider from "@providers/prismaProvider";

export type categoryResType = { id: number; title: string };

export default class ContentPrismaProvider {
	async onLike({ isLike, contentId, authorId }: { isLike: boolean; contentId: number; authorId: number }): Promise<Like> {
		if (isLike) {
			return await prismaProvider.like.create({ data: { authorId, contentId } });
		} else {
			return await prismaProvider.like.delete({ where: { contentId_authorId: { contentId, authorId } } });
		}
	}
}
