import { WageType } from "@prisma/client";
import prismaProvider from "@providers/prismaProvider";

const jobSelectedData = {
	benefits: true,
	description: true,
	id: true,
	province: true,
	requirements: true,
	teamId: true,
	title: true,
	updatedAt: true,
	wage: true,
	wageType: true,
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

export default class JobPrismaProvider {
	async create(body: createBodyType) {
		return await prismaProvider.job.create({ data: body, select: jobSelectedData });
	}

	async update(id: number, body: updateBodyType) {
		return await prismaProvider.job.update({ where: { id }, data: body, select: jobSelectedData });
	}

	async checkJobCountLimit({ teamId }: { teamId: number }) {
		const jobs = await prismaProvider.job.findMany({ where: { teamId } });
		return jobs.length;
	}

	async checkJobOwner({ jobId }: { jobId: number }) {
		return await prismaProvider.job.findFirst({
			where: { id: jobId },
			select: { team: { select: { id: true, managerId: true } } },
		});
	}
}
