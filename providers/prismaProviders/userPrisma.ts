import { iUserLogin } from "@models/iUser";
import prismaProvider from "@providers/prismaProvider";
import { categoryResType } from "./categoryPrisma";
import { provinceResType } from "./provincePrisma";
import { PermissionType } from "@prisma/client";

type userUniqueResType = {
	id: number;
	username: string;
	email: string;
	phone: string | null;
	account: {
		permission: PermissionType;
	};
};

type userResType = {
	id: number;
	firstName: string | null;
	lastName: string | null;
	username: string;
	interests: categoryResType[];
	province: provinceResType | null;
	email: string;
	phone: string | null;
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
	account: { select: { permission: true } },
};

export default class UserPrismaProvider {
	async getOne(userId: number) {
		try {
			const user: userResType | null = await prismaProvider.user.findUnique({ where: { id: userId }, select: userReturnField });
			return user;
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}

	async create(body: UserCreateArgs) {
		try {
			const { username, firstName, lastName, email, password } = body;
			const user: userResType = await prismaProvider.user.create({
				data: {
					username,
					firstName,
					lastName,
					email,
					account: { create: { password } },
				},
				select: userReturnField,
			});
			return user;
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}

	async update(userId: number, body: userUpdateArgs) {
		try {
			const { username, firstName, lastName, interests, provinceId } = body;
			const user: userResType = await prismaProvider.user.update({
				where: { id: userId },
				data: {
					username,
					firstName,
					lastName,
					provinceId,
					interests: { set: interests },
				},
				select: userReturnField,
			});
			return user;
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}

	async Activate(email: string) {
		try {
			const user: userResType = await prismaProvider.user.update({
				where: { email },
				data: { account: { update: { isActive: true } } },
				select: userReturnField,
			});

			return user;
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}

	async checkPassword({ password, id }: { password: string; id: number }) {
		try {
			const user: userUniqueResType | null = await prismaProvider.user.findFirst({
				where: { AND: [{ account: { password: { equals: password } } }, { id: { equals: id } }] },
				select: userUniqueReturnField,
			});
			return user;
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}

	async changePassword({ userId, password }: { userId: number; password: string }): Promise<userResType | "ERR"> {
		try {
			const user: userResType = await prismaProvider.user.update({
				where: { id: userId },
				data: { account: { update: { password } } },
				select: userReturnField,
			});
			return user;
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}

	async resetPassword({ email, password }: { email: string; password: string }) {
		try {
			const user: userUniqueResType = await prismaProvider.user.update({
				where: { email },
				data: { account: { update: { password } } },
				select: userUniqueReturnField,
			});
			return user;
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}

	async changeEmail({ oldEmail, newEmail }: { oldEmail: string; newEmail: string }) {
		try {
			const user: userResType = await prismaProvider.user.update({
				where: { email: oldEmail },
				data: { email: newEmail },
				select: userReturnField,
			});
			return user;
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}

	async addPhone({ phone, id }: { phone: string; id: number }) {
		try {
			const user: userResType = await prismaProvider.user.update({
				where: { id },
				data: { phone },
				select: userReturnField,
			});
			return user;
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}

	// TODO
	async checkEmailAuth({ email, password }: iUserLogin) {
		try {
			const user: userResType | null = await prismaProvider.user.findFirst({
				where: {
					AND: [
						{ email: { equals: email } },
						{ account: { password: { equals: password } } },
						{ account: { isActive: { equals: true } } },
					],
				},
				select: userReturnField,
			});
			return user;
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}

	//
	async checkUniqueField({ email, phone, username, userId }: uniqueFieldArgs) {
		try {
			const account = await prismaProvider.user.findFirst({
				where: {
					OR: [{ email: { equals: email } }, { phone: { equals: phone } }, { username: { equals: username } }],
					NOT: { id: { equals: userId } },
				},
				select: { email: true, phone: true, username: true, id: true },
			});
			return account;
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}

	async getByEmail({ email }: { email: string }) {
		try {
			const user = await prismaProvider.user.findUnique({
				where: { email },
				select: {
					id: true,
					email: true,
					account: { select: { isActive: true } },
				},
			});
			return user;
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}
}
