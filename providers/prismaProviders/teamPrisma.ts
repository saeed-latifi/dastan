import { iCRUD } from "@models/iCRUD";
import prismaProvider from "@providers/prismaProvider";

export default class TeamPrismaProvider implements iCRUD {
	async getSome(userId: number) {
		try {
			const teams = await prismaProvider.team.findMany({ where: { managerId: userId } });
			return teams;
		} catch (error) {
			return "ERR";
		}
	}

	async getOne(id: number) {
		try {
			const team = await prismaProvider.team.findFirst({ where: { id } });
			return team;
		} catch (error) {
			return "ERR";
		}
	}

	async create(body: { description: string; title: string; managerId: number; contactMethods?: string[] }) {
		try {
			const team = await prismaProvider.team.create({ data: body });
			return team;
		} catch (error) {
			return "ERR";
		}
	}

	async update(id: number, body: { description?: string; title?: string; contactMethods?: string[] }) {
		try {
			const team = await prismaProvider.team.update({ data: body, where: { id } });
			return team;
		} catch (error) {
			return "ERR";
		}
	}

	async delete(id: number) {
		throw new Error("Method not implemented.");
	}

	async checkUniqueField({ title, teamId }: { title?: string; teamId?: number }) {
		try {
			const team = await prismaProvider.team.findFirst({
				where: {
					OR: [{ title: { equals: title } }],
					NOT: { id: { equals: teamId } },
				},
				select: { title: true, id: true },
			});
			return team;
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}

	async checkTeamManager({ teamId }: { teamId: number }) {
		try {
			const team = await prismaProvider.team.findFirst({
				where: { id: teamId },
				select: { managerId: true },
			});
			return team;
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}

	async checkTeamCountLimit({ managerId }: { managerId: number }) {
		try {
			const teams = await prismaProvider.team.findMany({ where: { managerId } });
			return teams.length;
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}
}