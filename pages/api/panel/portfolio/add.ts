import { onErrorResponse, onSuccessResponse } from "@providers/apiResponseHandler";
import { formParser } from "@utilities/formParser";
import { NextApiRequest, NextApiResponse } from "next";
import { tokenValidator } from "@providers/tokenProvider";
import { portFolioImageAWS } from "@providers/bucketsAWS/imageAWS";
import { errorLogger } from "@utilities/apiLogger";
import UserPrismaProvider from "@providers/prismaProviders/userPrisma";
import formidable from "formidable";
import { bytesFromMb } from "@utilities/bytesFromMb";
import webpPortfolioBuffer from "@providers/imageGenerators/webpPortfolio";
import { v4 } from "uuid";

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
			if (!token) return res.json(onErrorResponse("portfolio access denied"));

			const { files } = await formParser(req);
			const reqImage = files.image as formidable.File;
			if (!reqImage) return res.json(onErrorResponse("no image file"));

			const mbLimitSize = 11;
			if (reqImage.size > bytesFromMb(mbLimitSize)) return res.json(onErrorResponse("so big profile file"));

			const buffer = await webpPortfolioBuffer({ path: reqImage.filepath });
			const fileName = v4() + "." + buffer.info.format;

			const awsRes = await portFolioImageAWS({ file: buffer.data, fileName });
			if (!awsRes) return res.json(onErrorResponse("error on aws"));

			const image = await userPrismaProvider.addPortfolioImage({ imageName: fileName, userId: token.userId });
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
