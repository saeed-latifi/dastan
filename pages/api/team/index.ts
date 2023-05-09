import { zTeamCreate, zTeamUpdate } from "@models/iTeam";
import { errorType, onErrorResponse, onSuccessResponse, onZodErrorResponse } from "@providers/apiResponseHandler";
import TeamPrismaProvider from "@providers/prismaProviders/teamPrisma";
import { removeCookieToken, tokenValidator } from "@providers/tokenProvider";
import { NextApiRequest, NextApiResponse } from "next";
import { teamLimits } from "statics/limits";

const teamPrismaProvider = new TeamPrismaProvider();
export default async function apiHandler(req: NextApiRequest, res: NextApiResponse) {
	// token
	// validation
	// prisma
	// api
	if (req.method === "GET") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) {
				removeCookieToken({ req, res });
				return res.json(onErrorResponse("bad user request"));
			}

			// prisma
			const teams = await teamPrismaProvider.getSome(token.userId);
			if (teams === "ERR") return res.json(onErrorResponse("Error on team ORM"));

			// api
			return res.json(onSuccessResponse(teams));
		} catch (error) {
			return res.json(onErrorResponse("err on create team"));
		}
	}

	// create new team
	if (req.method === "POST") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) {
				removeCookieToken({ req, res });
				return res.json(onErrorResponse("bad user request"));
			}

			// validation
			const validateData = zTeamCreate.safeParse(req.body);
			if (!validateData.success) return res.json(onZodErrorResponse(validateData.error.issues));
			const { title } = validateData.data;

			// prisma team count limit
			const teamsCount = await teamPrismaProvider.checkTeamCountLimit({ managerId: token.userId });
			if (teamsCount === "ERR") return res.json(onErrorResponse("Error on team ORM"));
			if (teamsCount >= teamLimits.number) return res.json(onErrorResponse("Error reached to limit of your teams number"));

			// prisma unique
			const notUnique = await teamPrismaProvider.checkUniqueField({ title });
			if (notUnique === "ERR") return res.json(onErrorResponse("Error on team ORM"));

			// validation
			if (notUnique) {
				const uniqueErrors: errorType = {};
				if (title === notUnique.title) uniqueErrors.title = "this title already taken";
				return res.json(onErrorResponse(uniqueErrors));
			}

			// prisma create
			const body = { ...validateData.data, managerId: token.userId };
			const team = await teamPrismaProvider.create(body);
			if (team === "ERR") return res.json(onErrorResponse("Error on team ORM"));

			// api
			return res.json(onSuccessResponse(team));
		} catch (error) {
			return res.json(onErrorResponse("err on create team"));
		}
	}

	// update team
	if (req.method === "PUT") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) {
				removeCookieToken({ req, res });
				return res.json(onErrorResponse("bad user request"));
			}

			// validation
			const validateData = zTeamUpdate.safeParse(req.body);
			if (!validateData.success) return res.json(onZodErrorResponse(validateData.error.issues));
			const { id, title, description, contactMethods } = validateData.data;

			// prisma check team manager
			const manager = await teamPrismaProvider.checkTeamManager({ teamId: id });
			if (manager === "ERR") return res.json(onErrorResponse("Error on team ORM"));
			if (manager === null) return res.json(onErrorResponse("this team not exist"));
			if (manager.managerId !== token.userId) return res.json(onErrorResponse("Error team access denied!"));

			// prisma
			const notUnique = await teamPrismaProvider.checkUniqueField({ title, teamId: id });
			if (notUnique === "ERR") return res.json(onErrorResponse("Error on team ORM"));

			// validation
			if (notUnique) {
				const uniqueErrors: errorType = {};
				if (title === notUnique.title) uniqueErrors.title = "this title already taken";
				return res.json(onErrorResponse(uniqueErrors));
			}

			// prisma
			const team = await teamPrismaProvider.update(id, { title, description, contactMethods });
			if (team === "ERR") return res.json(onErrorResponse("Error on team ORM"));

			// api
			return res.json(onSuccessResponse(team));
		} catch (error) {
			return res.json(onErrorResponse("err on update team"));
		}
	}

	// not supported method
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
