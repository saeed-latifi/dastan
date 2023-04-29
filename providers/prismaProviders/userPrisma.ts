import { iCRUD } from "@models/iCRUD";
import { iUserLogin } from "@models/iUser";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export default class UserPrismaProvider implements iCRUD {
	// don't return password and ... !
	private manyParams = {
		id: true,
		firstName: true,
		lastName: true,
		username: true,
		email: true,
		phone: true,
		permissionLevel: true,
		interests: true,
		province: true,
		slug: true,
	};

	private uniqueParams = { phone: true, username: true, email: true, id: true, isActive: true };

	async getSome(body: any) {
		try {
			const users = await prisma.user.findMany({
				skip: body.skip,
				take: body.take,
				select: this.manyParams,
			});
			return users;
		} catch (error) {
			return "ERR";
		}
	}

	async getOne(userId: number) {
		try {
			const user = await prisma.user.findUnique({ where: { id: userId }, select: this.manyParams });
			return user;
		} catch (error) {
			return "ERR";
		}
	}

	async create(body: any) {
		try {
			const user = await prisma.user.create({ data: body, select: this.manyParams });
			return user;
		} catch (error) {
			return "ERR";
		}
	}

	async update(userId: number, body: any) {
		try {
			const user = await prisma.user.update({ where: { id: userId }, data: body, select: this.manyParams });
			return user;
		} catch (error: any) {
			return "ERR";
		}
	}

	async delete(userId: number) {
		try {
			const user = await prisma.user.update({ where: { id: userId }, data: { isActive: false }, select: this.manyParams });
			return user;
		} catch (error) {
			return "ERR";
		}
	}

	async Activate(email: string) {
		try {
			const user = await prisma.user.update({ where: { email }, data: { isActive: true }, select: this.manyParams });
			return user;
		} catch (error) {
			return "ERR";
		}
	}

	async getAllUserAuth() {
		try {
			const user = await prisma.user.findMany({ select: { email: true, phone: true, password: true, isActive: true } });
			return user;
		} catch (error) {
			return "ERR";
		}
	}

	async checkEmailAuth({ email, password }: iUserLogin) {
		try {
			const user = await prisma.user.findFirst({
				where: {
					AND: [{ email: { equals: email } }, { password: { equals: password } }, { isActive: { equals: true } }],
				},
				select: this.manyParams,
			});
			return user;
		} catch (error) {
			return "ERR";
		}
	}

	async checkUniqueField({ email, phone, username, userId }: { email?: string; username?: string; phone?: string; userId?: number }) {
		try {
			const user = await prisma.user.findFirst({
				where: {
					OR: [{ email: { equals: email } }, { phone: { equals: phone } }, { username: { equals: username } }],
					NOT: { id: { equals: userId } },
				},
				select: this.uniqueParams,
			});
			return user;
		} catch (error) {
			return "ERR";
		}
	}

	async checkPassword({ password, id }: { password: string; id: number }) {
		try {
			const user = await prisma.user.findFirst({
				where: { AND: [{ password: { equals: password } }, { id: { equals: id } }] },
				select: this.uniqueParams,
			});
			return user;
		} catch (error) {
			return "ERR";
		}
	}

	async getByEmail({ email }: { email: string }) {
		try {
			const user = await prisma.user.findUnique({ where: { email }, select: this.uniqueParams });
			return user;
		} catch (error) {
			return "ERR";
		}
	}

	async resetPassword({ email, password }: { email: string; password: string }) {
		try {
			const user = await prisma.user.update({ where: { email }, data: { password }, select: this.uniqueParams });
			return user;
		} catch (error) {
			return "ERR";
		}
	}

	async changeEmail({ oldEmail, newEmail }: { oldEmail: string; newEmail: string }) {
		try {
			const user = await prisma.user.update({ where: { email: oldEmail }, data: { email: newEmail }, select: this.manyParams });
			return user;
		} catch (error) {
			return "ERR";
		}
	}

	async addPhone({ phone, id }: { phone: string; id: number }) {
		try {
			const user = await prisma.user.update({ where: { id }, data: { phone }, select: this.manyParams });
			return user;
		} catch (error) {
			return "ERR";
		}
	}
}
