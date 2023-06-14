import prismaProvider from "@providers/prismaProvider";

export type userFeedResType = {
	id: number;
	username: string;
	image: string | null;
	followers: {
		id: number;
	}[];
	_count: {
		followers: number;
		follows: number;
	};
	resume: {
		context: string;
		portfolio: string[];
	} | null;
} | null;

export type followResType = {
	isFollowed: boolean;
	userId: number;
};

export default class ResumePrismaProvider {
	// feed
	async getResumeFeed({ username, viewerId }: { username: string; viewerId?: number }): Promise<userFeedResType> {
		const user = await prismaProvider.user.findUnique({
			where: { username },
			select: {
				id: true,
				username: true,
				image: true,
				followers: !viewerId ? undefined : { where: { id: viewerId }, select: { id: true } },
				_count: { select: { followers: true, follows: true } },
				resume: { select: { context: true, portfolio: true } },
			},
		});
		return user;
	}

	async onFollow({ userId, viewerId }: { userId: number; viewerId: number }): Promise<followResType> {
		const isFollowed = await prismaProvider.user.findFirst({ where: { id: userId, followers: { some: { id: viewerId } } } });
		if (isFollowed) {
			await prismaProvider.user.update({ where: { id: userId }, data: { followers: { disconnect: { id: viewerId } } } });
		} else {
			await prismaProvider.user.update({ where: { id: userId }, data: { followers: { connect: { id: viewerId } } } });
		}

		return { isFollowed: !isFollowed, userId: viewerId };
	}
}
