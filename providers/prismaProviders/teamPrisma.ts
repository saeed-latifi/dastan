import prismaProvider from "@providers/prismaProvider";
import { jobPanelResType, jobPanelSelect } from "./jobPrisma";

export type teamPanelResType = {
	id: number;
	title: string;
	description: string;
	context: string | null;
	image: string | null;
	contactMethods: string[];
	jobs: jobPanelResType[];
	members: { id: number; username: string }[];
	managerId: number;
};

function teamPanelSelect() {
	return {
		id: true,
		title: true,
		description: true,
		context: true,
		contactMethods: true,
		image: true,
		managerId: true,
		members: { select: { username: true, id: true } },
		jobs: { select: jobPanelSelect() },
	};
}

export type teamImageRes = {
	image: string | null;
	id: number;
};

export default class TeamPrismaProvider {
	// panel
	async getByManager(managerId: number): Promise<teamPanelResType[]> {
		return await prismaProvider.team.findMany({ where: { managerId }, select: teamPanelSelect() });
	}

	async create(body: { description: string; title: string; managerId: number; contactMethods?: string[] }): Promise<teamPanelResType> {
		return await prismaProvider.team.create({ data: body, select: teamPanelSelect() });
	}

	async update(id: number, body: { description?: string; title?: string; contactMethods?: string[] }): Promise<teamPanelResType> {
		return await prismaProvider.team.update({ data: body, where: { id }, select: teamPanelSelect() });
	}

	async addImage({ teamId, imageName }: { teamId: number; imageName: string }): Promise<teamImageRes> {
		return await prismaProvider.team.update({ where: { id: teamId }, data: { image: imageName }, select: { image: true, id: true } });
	}

	// internal
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
		return await prismaProvider.team.count({ where: { managerId } });
	}
}
