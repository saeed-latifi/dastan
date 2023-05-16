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

// type args = { path: string; name: string };
// export default async function webp512({ path, name }: args) {
// 	try {
// 		const myPath = profileImagesPath;
// 		const info = await sharp(path)
// 			.resize(500, 500)
// 			.webp()
// 			.toFile(myPath + "/" + name + ".webp");
// 		return info;
// 	} catch (error) {
// 		throw error;
// 	}
// }
