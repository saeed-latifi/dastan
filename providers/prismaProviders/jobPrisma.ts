import { Category, Province, WageType } from "@prisma/client";
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
	category: Category;
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
	categoryId: number;
};

type updateBodyType = {
	description?: string;
	title?: string;
	wageType?: WageType;
	benefits?: string[];
	provinceId?: number | null;
	requirements?: string[];
	wage?: number;
	categoryId?: number;
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
		category: true,
	};
}

export function jobFeedSelect() {
	return {
		id: true,
		title: true,
		description: true,
		benefits: true,
		requirements: true,
		province: true,
		updatedAt: true,
		wageType: true,
		wage: true,
		category: true,
		team: { select: { title: true, id: true, image: true } },
	};
}

export type jobFeedType = {
	id: number;
	title: string;
	description: string;
	benefits: string[];
	requirements: string[];
	province: Province | null;
	updatedAt: Date;
	wageType: WageType;
	wage: number | null;
	category: Category;
	team: {
		title: string;
		id: number;
		image: string | null;
	};
};

export type jobFeedResType = {
	jobs: jobFeedType[];
	count?: number;
};

type getJobsArgs = { take: number; skip: number; categoryId?: number };
export default class JobPrismaProvider {
	// panel
	async create(body: createBodyType): Promise<jobPanelResType> {
		return await prismaProvider.job.create({
			data: body,
			select: jobPanelSelect(),
		});
	}

	async update(id: number, body: updateBodyType): Promise<jobPanelResType> {
		return await prismaProvider.job.update({ where: { id }, data: body, select: jobPanelSelect() });
	}

	// feed
	async get({ take, skip, categoryId }: getJobsArgs): Promise<jobFeedResType> {
		const jobCount = await prismaProvider.job.count({ where: { categoryId } });
		const jobs = await prismaProvider.job.findMany({
			where: { categoryId },
			select: jobFeedSelect(),
			take,
			skip,
		});
		return { jobs, count: jobCount };
	}

	// internal
	async checkJobCountLimit({ teamId }: { teamId: number }) {
		return await prismaProvider.job.count({ where: { teamId } });
	}

	async checkJobOwner({ jobId }: { jobId: number }) {
		return await prismaProvider.job.findFirst({ where: { id: jobId }, select: { team: { select: { id: true, managerId: true } } } });
	}
}
