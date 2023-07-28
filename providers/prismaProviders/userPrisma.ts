import { iUserLogin } from "@models/iUser";
import prismaProvider from "@providers/prismaProvider";
import { categoryResType } from "./categoryPrisma";
import { PermissionType, Province } from "@prisma/client";

// types
type userUpdateArgs = { username?: string; firstName?: string; lastName?: string; interests?: { id: number }[]; provinceId?: number };
type UserCreateArgs = { username: string; password: string; email: string; firstName?: string; lastName?: string };
type uniqueFieldArgs = { email?: string; phone?: string; username?: string; userId?: number };
export type followResType = { isFollowed: boolean; userId: number };
export type uerImageRes = { image: string | null };

type userUniqueResType = {
	id: number;
	username: string;
	email: string;
	phone: string | null;
	account: { permission: PermissionType };
};

export type userResType = {
	id: number;
	firstName: string | null;
	lastName: string | null;
	username: string;
	interests: categoryResType[];
	province: Province | null;
	email: string;
	phone: string | null;
	image: string | null;
	account: { permission: PermissionType };
	portfolio: string[];
	resumeContext: string;
};

export type userFeedResType = {
	id: number;
	username: string;
	image: string | null;
	portfolio: string[];
	resumeContext: string;
	followers: { id: number }[];
	_count: { followers: number; follows: number };
} | null;

export type userAdminResType = {
	id: number;
	username: string;
	firstName: string | null;
	lastName: string | null;
	image: string | null;
	email: string;
	phone: string | null;
	provinceId: number | null;
	resumeContext: string;
	portfolio: string[];
	accountId: string;
	account: {
		permission: PermissionType;
		createdAt: Date;
		isActive: boolean;
		isDeleted: boolean;
	};
};

// select
const userUniqueReturnField = { username: true, id: true, email: true, phone: true, account: { select: { permission: true } } };

const userReturnField = {
	id: true,
	firstName: true,
	lastName: true,
	username: true,
	interests: true,
	province: true,
	email: true,
	phone: true,
	image: true,
	account: { select: { permission: true } },
	portfolio: true,
	resumeContext: true,
};

const userFeedSelect = (viewerId?: number) => {
	return {
		id: true,
		image: true,
		username: true,
		portfolio: true,
		resumeContext: true,
		_count: { select: { followers: true, follows: true } },
		followers: !viewerId ? undefined : { where: { id: viewerId }, select: { id: true } },
	};
};

const userAdminInclude = { account: { select: { permission: true, createdAt: true, isActive: true, isDeleted: true } } };

export default class UserPrismaProvider {
	// account
	async getOne(userId: number): Promise<userResType | null> {
		return await prismaProvider.user.findUnique({ where: { id: userId }, select: userReturnField });
	}

	async create(body: UserCreateArgs): Promise<userResType> {
		const { username, firstName, lastName, email, password } = body;
		return await prismaProvider.user.create({
			data: { username, firstName, lastName, email, account: { create: { password } } },
			select: userReturnField,
		});
	}

	async update(userId: number, body: userUpdateArgs): Promise<userResType> {
		const { username, firstName, lastName, interests, provinceId } = body;
		return await prismaProvider.user.update({
			where: { id: userId },
			data: { username, firstName, lastName, provinceId, interests: { set: interests } },
			select: userReturnField,
		});
	}

	async Activate(email: string): Promise<userResType> {
		return await prismaProvider.user.update({
			where: { email },
			data: { account: { update: { isActive: true, permission: "USER" } } },
			select: userReturnField,
		});
	}

	async checkPassword({ password, id }: { password: string; id: number }): Promise<userUniqueResType | null> {
		return await prismaProvider.user.findFirst({
			where: { AND: [{ account: { password: { equals: password } } }, { id: { equals: id } }] },
			select: userUniqueReturnField,
		});
	}

	async changePassword({ userId, password }: { userId: number; password: string }): Promise<userResType> {
		return await prismaProvider.user.update({ where: { id: userId }, data: { account: { update: { password } } }, select: userReturnField });
	}

	async resetPassword({ email, password }: { email: string; password: string }): Promise<userUniqueResType> {
		return await prismaProvider.user.update({ where: { email }, data: { account: { update: { password } } }, select: userUniqueReturnField });
	}

	async changeEmail({ oldEmail, newEmail }: { oldEmail: string; newEmail: string }): Promise<userResType> {
		return await prismaProvider.user.update({ where: { email: oldEmail }, data: { email: newEmail }, select: userReturnField });
	}

	async addPhone({ phone, id }: { phone: string; id: number }): Promise<userResType> {
		return await prismaProvider.user.update({ where: { id }, data: { phone }, select: userReturnField });
	}

	async checkEmailAuth({ email, password }: iUserLogin): Promise<userResType | null> {
		return await prismaProvider.user.findFirst({
			where: {
				AND: [{ email: { equals: email } }, { account: { password: { equals: password } } }, { account: { isActive: { equals: true } } }],
			},
			select: userReturnField,
		});
	}

	async addImage({ userId, imageName }: { userId: number; imageName: string }): Promise<uerImageRes> {
		return await prismaProvider.user.update({ where: { id: userId }, data: { image: imageName }, select: { image: true } });
	}

	// portfolio
	async updateResume({ userId, resumeContext }: { userId: number; resumeContext: string }) {
		return await prismaProvider.user.update({ where: { id: userId }, data: { resumeContext }, select: userReturnField });
	}

	async addPortfolioImage({ userId, imageName }: { userId: number; imageName: string }) {
		return await prismaProvider.user.update({ where: { id: userId }, data: { portfolio: { push: imageName } }, select: userReturnField });
	}

	async removePortfolioImage({ userId, imageName }: { userId: number; imageName: string }) {
		const userPortfo = await prismaProvider.user.findFirst({ where: { id: userId }, select: { portfolio: true } });
		if (!userPortfo) return;

		return await prismaProvider.user.update({
			where: { id: userId },
			data: { portfolio: { set: userPortfo.portfolio.filter((image) => image !== imageName) } },
			select: userReturnField,
		});
	}

	// feed
	async getResumeFeed({ username, viewerId }: { username: string; viewerId?: number }): Promise<userFeedResType> {
		return await prismaProvider.user.findUnique({ where: { username }, select: userFeedSelect(viewerId) });
	}

	async onFollow({ userId, viewerId }: { userId: number; viewerId: number }): Promise<followResType> {
		const isFollowed = await prismaProvider.user.findFirst({ where: { id: userId, followers: { some: { id: viewerId } } } });
		if (isFollowed) await prismaProvider.user.update({ where: { id: userId }, data: { followers: { disconnect: { id: viewerId } } } });
		else await prismaProvider.user.update({ where: { id: userId }, data: { followers: { connect: { id: viewerId } } } });
		return { isFollowed: !isFollowed, userId: viewerId };
	}

	//internal
	async checkUniqueField({ email, phone, username, userId }: uniqueFieldArgs) {
		return await prismaProvider.user.findFirst({
			where: {
				OR: [{ email: { equals: email } }, { phone: { equals: phone } }, { username: { equals: username } }],
				NOT: { id: { equals: userId } },
			},
			select: { email: true, phone: true, username: true, id: true },
		});
	}

	async getByEmail({ email }: { email: string }) {
		return await prismaProvider.user.findUnique({
			where: { email },
			select: { id: true, email: true, account: { select: { isActive: true } } },
		});
	}

	// admin
	async adminUsersList({ isActive, skip, take }: { take: number; skip: number; isActive?: boolean }): Promise<{ users: userAdminResType[]; count: number }> {
		const count = await prismaProvider.user.count({ where: { account: { isActive } } });
		const users = await prismaProvider.user.findMany({ take, skip, where: { account: { isActive } }, include: userAdminInclude });
		return { users, count };
	}

	async adminGetUser(username: string): Promise<userAdminResType | null> {
		return await prismaProvider.user.findFirst({ where: { username }, include: userAdminInclude });
	}
}
