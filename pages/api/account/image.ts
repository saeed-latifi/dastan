import { onErrorResponse, onSuccessResponse } from "@providers/apiResponseHandler";
import { formParser } from "@utilities/formParser";
import { NextApiRequest, NextApiResponse } from "next";
import webpSquareBuffer from "@providers/imageGenerators/webpSquare";
import { tokenFixer, tokenValidator } from "@providers/tokenProvider";
import { profileImageAWS } from "@providers/bucketsAWS/imageAWS";
import { errorLogger } from "@utilities/apiLogger";
import UserPrismaProvider from "@providers/prismaProviders/userPrisma";
import formidable from "formidable";

export const config = {
	api: {
		bodyParser: false,
	},
};

const userPrismaProvider = new UserPrismaProvider();

export default async function profileImageApi(req: NextApiRequest, res: NextApiResponse) {
	// add image
	if (req.method === "POST") {
		try {
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) return tokenFixer({ req, res });

			const id = token.userId;
			const { files } = await formParser(req);
			const reqImage = files.image as formidable.File;
			if (!reqImage) return res.json(onErrorResponse("no image file"));

			const buffer = await webpSquareBuffer({ path: reqImage.filepath });
			const fileName = id + "." + buffer.info.format;

			const awsRes = await profileImageAWS({ file: buffer.data, fileName, ContentType: buffer.info.format });
			if (!awsRes) return res.json(onErrorResponse("error on aws"));

			const image = await userPrismaProvider.addImage({ imageName: fileName, userId: id });
			if (!image) return res.json(onErrorResponse("error on create image"));

			// ok res
			return res.json(onSuccessResponse(image));
		} catch (error) {
			return errorLogger({ error, res, name: "image" });
		}
	}

	// not supported method
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
