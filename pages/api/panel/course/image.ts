import { onErrorResponse, onSuccessResponse } from "@providers/apiResponseHandler";
import { formParser } from "@utilities/formParser";
import { NextApiRequest, NextApiResponse } from "next";
import { removeCookieToken, tokenValidator } from "@providers/tokenProvider";
import CoursePrismaProvider from "@providers/prismaProviders/coursePrisma";
import webpLandscapeBuffer from "@providers/imageGenerators/webpLandscape";
import { courseImageAWS } from "@providers/bucketsAWS/imageAWS";

export const config = {
	api: {
		bodyParser: false,
	},
};

const coursePrismaProvider = new CoursePrismaProvider();
export default async function courseImageApi(req: NextApiRequest, res: NextApiResponse) {
	// add image
	if (req.method === "POST") {
		try {
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) {
				removeCookieToken({ req, res });
				return res.json(onErrorResponse("bad profile request"));
			}

			const { files, fields } = await formParser(req);
			if (!fields.contentId || !files.image) return res.json(onErrorResponse("incomplete course information"));

			// prisma check course manager
			const author = await coursePrismaProvider.checkCourseAuthor({ contentId: fields.contentId });
			if (author === "ERR") return res.json(onErrorResponse("error on course ORM"));
			if (author === null) return res.json(onErrorResponse("this course not exist"));
			if (author.authorId !== token.userId) return res.json(onErrorResponse("course err : access denied!"));

			// sharp
			const buffer = await webpLandscapeBuffer({ path: files.image.filepath });
			const fileName = fields.contentId + "." + buffer.info.format;

			// aws
			const awsRes = await courseImageAWS({ file: buffer.data, fileName, ContentType: buffer.info.format });
			if (!awsRes) return res.json(onErrorResponse("error on aws"));

			// ok res
			return res.json(onSuccessResponse("ok"));
		} catch (error) {
			return res.json(onErrorResponse("err course logo"));
		}
	}

	// not supported method
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
