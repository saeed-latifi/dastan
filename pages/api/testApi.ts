import { onErrorResponse, onSuccessResponse } from "@providers/apiResponseHandler";
import TempOTP from "@providers/tempOTP";
import { NextApiRequest, NextApiResponse } from "next";

export default async function apiHandler(req: NextApiRequest, res: NextApiResponse) {
	// token
	// validation
	// prisma
	// api

	if (req.method === "GET") {
		try {
		} catch (error) {}
	}

	// not supported method
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
