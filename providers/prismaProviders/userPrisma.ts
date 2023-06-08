import { iUserLogin } from "@models/iUser";
import prismaProvider from "@providers/prismaProvider";
import { categoryResType } from "./categoryPrisma";
import { PermissionType, Province } from "@prisma/client";

type userUniqueResType = {
	id: number;
	username: string;
	email: string;
	phone: string | null;
	account: {
		permission: PermissionType;
	};
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
	account: {
		permission: PermissionType;
	};
};

type UserCreateArgs = { username: string; password: string; email: string; firstName?: string; lastName?: string };
type userUpdateArgs = { username?: string; firstName?: string; lastName?: string; interests?: { id: number }[]; provinceId?: number };
type uniqueFieldArgs = { email?: string; phone?: string; username?: string; userId?: number };

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
};

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
		return await prismaProvider.user.update({
			where: { id: userId },
			data: { account: { update: { password } } },
			select: userReturnField,
		});
	}

	async resetPassword({ email, password }: { email: string; password: string }): Promise<userUniqueResType> {
		return await prismaProvider.user.update({
			where: { email },
			data: { account: { update: { password } } },
			select: userUniqueReturnField,
		});
	}

	async changeEmail({ oldEmail, newEmail }: { oldEmail: string; newEmail: string }): Promise<userResType> {
		return await prismaProvider.user.update({
			where: { email: oldEmail },
			data: { email: newEmail },
			select: userReturnField,
		});
	}

	async addPhone({ phone, id }: { phone: string; id: number }): Promise<userResType> {
		return await prismaProvider.user.update({
			where: { id },
			data: { phone },
			select: userReturnField,
		});
	}

	async checkEmailAuth({ email, password }: iUserLogin): Promise<userResType | null> {
		return await prismaProvider.user.findFirst({
			where: {
				AND: [
					{ email: { equals: email } },
					{ account: { password: { equals: password } } },
					{ account: { isActive: { equals: true } } },
				],
			},
			select: userReturnField,
		});
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

	async addImage({ userId, imageName }: { userId: number; imageName: string }) {
		return await prismaProvider.user.update({ where: { id: userId }, data: { image: imageName }, select: { image: true } });
	}
}
