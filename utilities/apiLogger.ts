import { onErrorResponse } from "@providers/apiResponseHandler";
import { NextApiResponse } from "next";

export function errorLogger({ error, res, name }: { error: any; res: NextApiResponse; name: string }) {
	// TODO
	// console.log(error);
	console.log("error on", name);
	return res.status(500).json(onErrorResponse(`error on ${name}`));
}
