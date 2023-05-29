import { NextApiRequest, NextApiResponse } from "next";
import ProvincePrismaProvider from "@providers/prismaProviders/provincePrisma";
import { onErrorResponse, onSuccessResponse } from "@providers/apiResponseHandler";

const provincePrismaProvider = new ProvincePrismaProvider();
export default async function apiHandler(req: NextApiRequest, res: NextApiResponse) {
	// identify
	if (req.method === "GET") {
		try {
			// prisma
			const provinces = await provincePrismaProvider.getSome();

			// api
			return res.json(onSuccessResponse(provinces));
		} catch (error) {
			return res.json(onErrorResponse("err on provinces"));
		}
	}

	// not supported method
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
