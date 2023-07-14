import { zJobCreate, zJobUpdate } from "@models/iJob";
import { errorType, onErrorResponse, onSuccessResponse, onZodErrorResponse } from "@providers/apiResponseHandler";
import JobPrismaProvider from "@providers/prismaProviders/jobPrisma";
import { removeCookieToken, tokenValidator } from "@providers/tokenProvider";
import { errorLogger } from "@utilities/apiLogger";
import { NextApiRequest, NextApiResponse } from "next";
import { jobLimits } from "statics/measures";

const jobPrismaProvider = new JobPrismaProvider();
export default async function apiHandler(req: NextApiRequest, res: NextApiResponse) {
	// create new job
	if (req.method === "POST") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) {
				removeCookieToken({ req, res });
				return res.json(onErrorResponse("bad user request"));
			}

			// validation
			const validateData = zJobCreate.safeParse(req.body);
			if (!validateData.success) return res.json(onZodErrorResponse(validateData.error.issues));
			const { teamId } = validateData.data;

			// prisma job count limit
			const jobsCount = await jobPrismaProvider.checkJobCountLimit({ teamId });
			if (jobsCount >= jobLimits.number) return res.json(onErrorResponse("Error reached to limit of your jobs number"));

			// prisma create

			const team = await jobPrismaProvider.create(validateData.data);

			// api
			return res.json(onSuccessResponse(team));
		} catch (error) {
			return errorLogger({ error, res, name: "job" });
		}
	}

	// update job
	if (req.method === "PUT") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) {
				removeCookieToken({ req, res });
				return res.json(onErrorResponse("bad user request"));
			}

			// validation
			const validateData = zJobUpdate.safeParse(req.body);
			if (!validateData.success) return res.json(onZodErrorResponse(validateData.error.issues));
			const { id } = validateData.data;
			const body: any = validateData.data;
			delete body.id;

			// prisma check team manager
			const teamInfo = await jobPrismaProvider.checkJobOwner({ jobId: id });
			if (teamInfo === null) return res.json(onErrorResponse("this job not exist"));
			if (teamInfo.team.managerId !== token.userId) return res.json(onErrorResponse("Error job access denied!"));

			// prisma
			const job = await jobPrismaProvider.update(id, body);

			// api
			return res.json(onSuccessResponse(job));
		} catch (error) {
			return errorLogger({ error, res, name: "job" });
		}
	}

	// not supported method
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
