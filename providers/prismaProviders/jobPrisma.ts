import { iCRUD } from "@models/iCRUD";
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

export default class JobPrismaProvider implements iCRUD {
	getSome(body: any) {
		throw new Error("Method not implemented.");
	}
	getOne(id: number) {
		throw new Error("Method not implemented.");
	}
	delete(id: number) {
		throw new Error("Method not implemented.");
	}

	async create(body: createBodyType) {
		try {
			const job = await prismaProvider.job.create({ data: body, select: jobSelectedData });
			return job;
		} catch (error) {
			return "ERR";
		}
	}

	async update(id: number, body: updateBodyType) {
		try {
			const job = await prismaProvider.job.update({ where: { id }, data: body, select: jobSelectedData });
			return job;
		} catch (error) {
			return "ERR";
		}
	}

	async checkJobCountLimit({ teamId }: { teamId: number }) {
		try {
			const jobs = await prismaProvider.job.findMany({ where: { teamId } });
			return jobs.length;
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}

	async checkJobOwner({ jobId }: { jobId: number }) {
		try {
			const job = await prismaProvider.job.findFirst({
				where: { id: jobId },
				select: { team: { select: { id: true, managerId: true } } },
			});
			return job;
		} catch (error) {
			console.log("error :: ", error);
			return "ERR";
		}
	}
}
