import { onErrorResponse, onSuccessResponse } from "@providers/apiResponseHandler";
import TeamPrismaProvider from "@providers/prismaProviders/teamPrisma";
import { errorLogger } from "@utilities/apiLogger";
import { NextApiRequest, NextApiResponse } from "next";

const teamPrismaProvider = new TeamPrismaProvider();
export default async function apiHandler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET") {
		try {
			const { id } = req.query;
			console.log(req.query);

			if (!id || !parseInt(id as string)) return res.json(onErrorResponse("bad team request"));

			// prisma
			const team = await teamPrismaProvider.getTeamFeed(parseInt(id as string));
			if (!team) return res.json(onErrorResponse("not correct team id"));

			// api
			return res.json(onSuccessResponse(team));
		} catch (error) {
			return errorLogger({ error, res, name: "course" });
		}
	}

	// not supported method
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
