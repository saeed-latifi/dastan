import { onErrorResponse } from "@providers/apiResponseHandler";
import CategoryPrismaProvider from "@providers/prismaProviders/categoyPrisma";
import ProvincePrismaProvider from "@providers/prismaProviders/provincePrisma";
import { NextApiRequest, NextApiResponse } from "next";

const categoryPrismaProvider = new CategoryPrismaProvider();
const provincePrismaProvider = new ProvincePrismaProvider();
export default async function apiHandler(req: NextApiRequest, res: NextApiResponse) {
	// token
	// validation
	// prisma
	// api

	if (req.method === "GET") {
		try {
			categoryPrismaProvider.seed();
			provincePrismaProvider.seed();
			return res.send("ok");
		} catch (error) {}
	}

	// not supported method
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
