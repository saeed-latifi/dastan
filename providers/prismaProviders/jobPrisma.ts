import { Province, WageType } from "@prisma/client";
import prismaProvider from "@providers/prismaProvider";

export type jobPanelResType = {
	title: string;
	description: string;
	id: number;
	teamId: number;
	updatedAt: Date;
	wageType: WageType;
	wage: number | null;
	benefits: string[];
	requirements: string[];
	province: Province | null;
};

type createBodyType = {
	teamId: number;
	description: string;
	title: string;
	wageType: WageType;
	benefits?: string[];
	provinceId?: number | null;
	requirements?: string[];
	wage?: number;
};

type updateBodyType = {
	description?: string;
	title?: string;
	wageType?: WageType;
	benefits?: string[];
	provinceId?: number | null;
	requirements?: string[];
	wage?: number;
};

export function jobPanelSelect() {
	return {
		id: true,
		title: true,
		description: true,
		benefits: true,
		requirements: true,
		province: true,
		teamId: true,
		updatedAt: true,
		wageType: true,
		wage: true,
	};
}

export default class JobPrismaProvider {
	// panel
	async create(body: createBodyType): Promise<jobPanelResType> {
		return await prismaProvider.job.create({ data: body, select: jobPanelSelect() });
	}

	async update(id: number, body: updateBodyType): Promise<jobPanelResType> {
		return await prismaProvider.job.update({ where: { id }, data: body, select: jobPanelSelect() });
	}

	// internal
	async checkJobCountLimit({ teamId }: { teamId: number }) {
		return await prismaProvider.job.count({ where: { teamId } });
	}

	async checkJobOwner({ jobId }: { jobId: number }) {
		return await prismaProvider.job.findFirst({ where: { id: jobId }, select: { team: { select: { id: true, managerId: true } } } });
	}
}
