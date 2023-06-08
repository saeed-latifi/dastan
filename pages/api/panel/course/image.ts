import { onErrorResponse, onSuccessResponse } from "@providers/apiResponseHandler";
import { formParser } from "@utilities/formParser";
import { NextApiRequest, NextApiResponse } from "next";
import { removeCookieToken, tokenValidator } from "@providers/tokenProvider";
import CoursePrismaProvider from "@providers/prismaProviders/coursePrisma";
import webpLandscapeBuffer from "@providers/imageGenerators/webpLandscape";
import { courseImageAWS } from "@providers/bucketsAWS/imageAWS";
import { errorLogger } from "@utilities/apiLogger";

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
				return res.json(onErrorResponse("bad course request"));
			}
			const { files, fields } = await formParser(req);
			if (!fields.courseId || !files.image) return res.json(onErrorResponse("incomplete course information"));
			// prisma check course manager
			const author = await coursePrismaProvider.checkCourseAuthor({ courseId: parseInt(fields.courseId) });
			if (author === null) return res.json(onErrorResponse("this course not exist"));
			if (author.content.authorId !== token.userId) return res.json(onErrorResponse("course err : access denied!"));
			// sharp
			const buffer = await webpLandscapeBuffer({ path: files.image.filepath });
			const fileName = fields.courseId + "." + buffer.info.format;
			// aws
			const awsRes = await courseImageAWS({ file: buffer.data, fileName, ContentType: buffer.info.format });
			if (!awsRes) return res.json(onErrorResponse("error on aws"));

			const image = await coursePrismaProvider.addImage({ imageName: fileName, courseId: parseInt(fields.courseId) });
			if (!image) return res.json(onErrorResponse("error on create image"));

			// ok res
			return res.json(onSuccessResponse(image));
		} catch (error) {
			return errorLogger({ error, res, name: "course" });
		}
	}
	// not supported method
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
