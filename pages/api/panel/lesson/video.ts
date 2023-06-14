import { onErrorResponse, onSuccessResponse } from "@providers/apiResponseHandler";
import { errorLogger } from "@utilities/apiLogger";
import { formParser } from "@utilities/formParser";
import busboy from "busboy";
import formidable from "formidable";
import { IncomingForm } from "formidable";
import { WriteStream, createReadStream, createWriteStream, statSync } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { AWSProfileConfig, imageBucketName } from "statics/keys";
import AWS from "aws-sdk";
import { Stream } from "stream";

export const config = {
	api: {
		bodyParser: false,
	},
};

// export const config = {
// 	api: {
// 		bodyParser: {
// 			sizeLimit: "10mb", // Set desired value here
// 		},
// 	},
// };

export default async function apiHandler(req: NextApiRequest, res: NextApiResponse) {
	// create new video
	if (req.method === "POST") {
		uploadVideoStream(req, res);
	}

	// not supported method
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
function uploadFromStream({ S3, fileName }: { S3: AWS.S3; fileName: string }) {
	const pass = new Stream.PassThrough();

	const params: AWS.S3.PutObjectRequest = {
		Bucket: imageBucketName + "/video",
		Key: fileName,
		Body: pass,
		ContentType: "video/mp4",
	};

	S3.upload(params, function (err, data) {
		console.log(err, data);
	});

	return pass;
}

function uploadVideoStream(req: NextApiRequest, res: NextApiResponse) {
	const bb = busboy({ headers: req.headers });

	bb.on("file", (_, file, info) => {
		// auth-api.mp4
		const fileName = `${req.query.lessonId}.mp4`;
		console.log(" info : ", info);

		// const fileName = info.filename;
		const filePath = `./videos/${fileName}`;

		const stream = createWriteStream(filePath);

		//

		const S3 = new AWS.S3(AWSProfileConfig);

		const params: AWS.S3.PutObjectRequest = {
			Bucket: imageBucketName + "/video",
			Key: fileName,
			Body: file,
			ContentType: "image/webp",
			ContentDisposition: `inline; filename="${fileName}"`,
		};
		// const res = await S3.upload(params).promise();

		file.pipe(uploadFromStream({ S3, fileName }));
	});

	bb.on("close", () => {
		res.writeHead(200, { Connection: "close" });
		res.end(`That's the end`);
	});

	req.pipe(bb);
	return;
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
