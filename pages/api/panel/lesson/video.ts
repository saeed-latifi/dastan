import { onErrorResponse, onSuccessResponse } from "@providers/apiResponseHandler";
import { errorLogger } from "@utilities/apiLogger";
import busboy from "busboy";
import { createReadStream, statSync } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { AWSProfileConfig, imageBucketName } from "statics/keys";
import AWS from "aws-sdk";
import { Stream } from "stream";
import { removeCookieToken, tokenValidator } from "@providers/tokenProvider";
import LessonPrismaProvider from "@providers/prismaProviders/lessonPrisma";

export const config = {
	api: {
		bodyParser: false,
	},
};
const lessonPrismaProvider = new LessonPrismaProvider();
export default async function apiHandler(req: NextApiRequest, res: NextApiResponse) {
	// create new video
	if (req.method === "POST") {
		try {
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) {
				removeCookieToken({ req, res });
				return res.json(onErrorResponse("bad course request"));
			}
			const lessonId = req.query.lessonId;
			const duration = req.query.duration;
			if (!lessonId || !duration) return onErrorResponse("Incomplete information for lesson");

			// prisma check course manager
			const author = await lessonPrismaProvider.checkLessonAuthor({ lessonId: parseInt(lessonId as string) });
			if (author === null) return res.json(onErrorResponse("this lesson not exist"));
			if (author.course.content.authorId !== token.userId) return res.json(onErrorResponse("lesson err : access denied!"));

			const location = await uploadVideoStream(req);
			const lesson = await lessonPrismaProvider.updateVideo({
				id: parseInt(lessonId as string),
				duration: parseInt(duration as string),
				videoUrl: location,
			});

			return res.json(onSuccessResponse(lesson));
		} catch (error) {
			return errorLogger({ error, res, name: "lesson video" });
		}
	}

	// not supported method
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}

function uploadVideoStream(req: NextApiRequest) {
	return new Promise<string>((resolve, reject) => {
		const bb = busboy({ headers: req.headers });
		const S3 = new AWS.S3(AWSProfileConfig);

		bb.on("file", (_, file, info) => {
			const exType = info.mimeType.split("/")[1];
			const fileName = `${req.query.lessonId}.${exType}`;

			const pass = new Stream.PassThrough();

			const params: AWS.S3.PutObjectRequest = {
				Bucket: imageBucketName + "/video",
				Key: fileName,
				Body: pass,
				ContentType: "video/mp4",
			};

			S3.upload(params, (err, data) => {
				if (err) reject("err on s3");
				resolve(data.Location);
			});

			file.pipe(pass);
		});

		bb.on("error", () => reject("error on busboy"));

		req.pipe(bb);
	});
}

function getVideoStream(req: NextApiRequest, res: NextApiResponse) {
	const CHUNK_SIZE_IN_BYTES = 1000000;

	const range = req.headers.range;

	if (!range) {
		return res.status(400).send("Rang must be provided");
	}

	const videoId = req.query.videoId;

	const videoPath = `./videos/${videoId}.mp4`;

	const videoSizeInBytes = statSync(videoPath).size;

	const chunkStart = Number(range.replace(/\D/g, ""));

	const chunkEnd = Math.min(chunkStart + CHUNK_SIZE_IN_BYTES, videoSizeInBytes - 1);

	const contentLength = chunkEnd - chunkStart + 1;

	const headers = {
		"Content-Range": `bytes ${chunkStart}-${chunkEnd}/${videoSizeInBytes}`,
		"Accept-Ranges": "bytes",
		"Content-Length": contentLength,
		"Content-Type": "video/mp4",
	};

	res.writeHead(206, headers);
	const videoStream = createReadStream(videoPath, {
		start: chunkStart,
		end: chunkEnd,
	});

	videoStream.pipe(res);
}
