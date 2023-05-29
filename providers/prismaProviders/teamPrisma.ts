import prismaProvider from "@providers/prismaProvider";

const jobSelect = {
	jobs: {
		select: {
			wageType: true,
			benefits: true,
			description: true,
			id: true,
			province: true,
			requirements: true,
			title: true,
			updatedAt: true,
			wage: true,
			teamId: true,
		},
	},
};

export default class TeamPrismaProvider {
	async getSome(userId: number) {
		return await prismaProvider.team.findMany({ where: { managerId: userId }, include: jobSelect });
	}

	async create(body: { description: string; title: string; managerId: number; contactMethods?: string[] }) {
		const team = await prismaProvider.team.create({ data: body, include: jobSelect });
		return team;
	}

	async update(id: number, body: { description?: string; title?: string; contactMethods?: string[] }) {
		return await prismaProvider.team.update({ data: body, where: { id }, include: jobSelect });
	}

	async checkUniqueField({ title, teamId }: { title?: string; teamId?: number }) {
		return await prismaProvider.team.findFirst({
			where: { OR: [{ title: { equals: title } }], NOT: { id: { equals: teamId } } },
			select: { title: true, id: true },
		});
	}

	async checkTeamManager({ teamId }: { teamId: number }) {
		return await prismaProvider.team.findFirst({ where: { id: teamId }, select: { managerId: true } });
	}

	async checkTeamCountLimit({ managerId }: { managerId: number }) {
		return await prismaProvider.team.findMany({ where: { managerId } });
	}
}
