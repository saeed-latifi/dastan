import sharp from "sharp";
import { squareImage } from "statics/measures";

export default async function webpSquareBuffer({ path }: { path: string }) {
	try {
		const buffer = await sharp(path).resize(squareImage.width, squareImage.height).webp().toBuffer({ resolveWithObject: true });
		return buffer;
	} catch (error) {
		throw error;
	}
}
