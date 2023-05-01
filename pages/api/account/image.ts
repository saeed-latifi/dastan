import { onErrorResponse, onSuccessResponse } from "@providers/apiResponseHandler";
import { formParser } from "@utilities/formParser";
import { NextApiRequest, NextApiResponse } from "next";
import webp512Buffer from "@providers/imageGenerators/webp512";
import { removeCookieToken, tokenValidator } from "@providers/tokenProvider";
import profileImageAWS from "@providers/bucketsAWS/profileImageAWS";

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function profileImageApi(req: NextApiRequest, res: NextApiResponse) {
	// add image
	if (req.method === "POST") {
		try {
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) {
				removeCookieToken({ req, res });
				return res.json(onErrorResponse("bad profile request"));
			}
			const slug = token.slug;
			const { files } = await formParser(req);
			if (files.image) {
				const buffer = await webp512Buffer({ path: files.image.filepath });
				const fileName = slug + "." + buffer.info.format;

				//TODO  To download server
				const awsRes = await profileImageAWS({ file: buffer.data, fileName, ContentType: buffer.info.format });
				if (awsRes) return res.json(onSuccessResponse("ok"));
				else return res.json(onErrorResponse("error on aws"));
			} else {
				return res.json(onErrorResponse("no image file"));
			}
		} catch (error) {
			return res.json(onErrorResponse("err on sharp"));
		}
	}

	// not supported method
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
