import AWS from "aws-sdk";
import { AWSProfileConfig, bucketName } from "statics/keys";

const S3 = new AWS.S3(AWSProfileConfig);
export async function profileImageAWS({ file, fileName, ContentType }: { file: AWS.S3.Body; fileName: string; ContentType: string }) {
	try {
		const params: AWS.S3.PutObjectRequest = {
			Bucket: bucketName + "/profile",
			Key: fileName,
			Body: file,
			ContentType: "image/webp",
			ContentDisposition: `inline; filename="${fileName}"`,
		};
		const res = await S3.upload(params).promise();
		return res;
	} catch (error) {
		return false;
	}
}

export async function teamLogoAWS({ file, fileName, ContentType }: { file: AWS.S3.Body; fileName: string; ContentType: string }) {
	try {
		const params: AWS.S3.PutObjectRequest = {
			Bucket: bucketName + "/team",
			Key: fileName,
			Body: file,
			ContentType: "image/webp",
			ContentDisposition: `inline; filename="${fileName}"`,
		};
		const res = await S3.upload(params).promise();
		return res;
	} catch (error) {
		return false;
	}
}

export async function courseImageAWS({ file, fileName, ContentType }: { file: AWS.S3.Body; fileName: string; ContentType: string }) {
	try {
		const params: AWS.S3.PutObjectRequest = {
			Bucket: bucketName + "/course",
			Key: fileName,
			Body: file,
			ContentType: "image/webp",
			ContentDisposition: `inline; filename="${fileName}"`,
		};
		const res = await S3.upload(params).promise();
		return res;
	} catch (error) {
		return false;
	}
}
