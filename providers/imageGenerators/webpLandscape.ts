import sharp from "sharp";

export default async function webpLandscapeBuffer({ path }: { path: string }) {
	try {
		const buffer = await sharp(path).resize(1280, 720).webp().toBuffer({ resolveWithObject: true });
		return buffer;
	} catch (error) {
		throw error;
	}
}
