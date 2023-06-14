import { onErrorResponse, onSuccessResponse } from "@providers/apiResponseHandler";
import { errorLogger } from "@utilities/apiLogger";
import { formParser } from "@utilities/formParser";
import formidable from "formidable";
import { createReadStream } from "fs";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function apiHandler(req: NextApiRequest, res: NextApiResponse) {
	// create new video
	if (req.method === "POST") {
		try {
			const { files, fields } = await formParser(req);
			if (!files.video) return res.json(onErrorResponse("incomplete video information"));
			const video = files.video as formidable.File;

			const stream = createReadStream(video.filepath);

			stream.on("data", (chunk) => console.log(chunk));
			stream.on("end", () => console.log("end"));

			// api
			return res.json(onSuccessResponse("ok"));
		} catch (error) {
			return errorLogger({ error, res, name: "lesson" });
		}
	}

	// not supported method
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
