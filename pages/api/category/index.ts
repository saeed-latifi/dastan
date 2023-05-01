import { NextApiRequest, NextApiResponse } from "next";
import { onErrorResponse, onSuccessResponse } from "@providers/apiResponseHandler";
import CategoryPrismaProvider from "@providers/prismaProviders/categoryPrisma";

const categoryPrismaProvider = new CategoryPrismaProvider();
export default async function apiHandler(req: NextApiRequest, res: NextApiResponse) {
	// identify
	if (req.method === "GET") {
		try {
			// prisma
			const categories = await categoryPrismaProvider.getSome();
			if (categories === "ERR") return res.json(onErrorResponse("err on categories ORM"));

			// api
			return res.json(onSuccessResponse(categories));
		} catch (error) {
			return res.json(onErrorResponse("err on categories"));
		}
	}

	// not supported method
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
