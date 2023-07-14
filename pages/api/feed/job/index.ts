import { zJobFeed, zJobFeedById } from "@models/iJob";
import { onErrorResponse, onSuccessResponse, onZodErrorResponse } from "@providers/apiResponseHandler";
import JobPrismaProvider from "@providers/prismaProviders/jobPrisma";
import { errorLogger } from "@utilities/apiLogger";
import { NextApiRequest, NextApiResponse } from "next";

const jobPrismaProvider = new JobPrismaProvider();
export default async function apiHandler(req: NextApiRequest, res: NextApiResponse) {
	// jobs list
	if (req.method === "PUT") {
		try {
			const validateData = zJobFeed.safeParse(req.body);
			if (!validateData.success) return res.json(onZodErrorResponse(validateData.error.issues));

			// prisma
			const jobs = await jobPrismaProvider.get(validateData.data);

			// api
			return res.json(onSuccessResponse(jobs));
		} catch (error) {
			return errorLogger({ error, res, name: "course" });
		}
	}

	// single job
	if (req.method === "PATCH") {
		try {
			const validateData = zJobFeedById.safeParse(req.body);
			if (!validateData.success) return res.json(onZodErrorResponse(validateData.error.issues));

			// prisma
			const job = await jobPrismaProvider.getById({ id: validateData.data.id });
			if (!job) return res.json(onErrorResponse("this job id not exists."));

			// api
			return res.json(onSuccessResponse(job));
		} catch (error) {
			return errorLogger({ error, res, name: "course" });
		}
	}

	// not supported method
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
