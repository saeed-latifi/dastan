import { onErrorResponse } from "@providers/apiResponseHandler";
import { NextApiResponse } from "next";

export function errorLogger({ error, res, name }: { error: any; res: NextApiResponse; name: string }) {
	// TODO
	console.log("error on", name);
	console.log(error);
	return res.status(500).json(onErrorResponse(`error on ${name}`));
}
