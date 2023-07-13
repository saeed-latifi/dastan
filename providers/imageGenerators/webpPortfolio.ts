import sharp from "sharp";

export default async function webpPortfolioBuffer({ path }: { path: string }) {
	try {
		const buffer = await sharp(path).webp().toBuffer({ resolveWithObject: true });
		return buffer;
	} catch (error) {
		throw error;
	}
}
