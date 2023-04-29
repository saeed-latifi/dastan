import sharp from "sharp";

export default async function webp512Buffer({ path }: { path: string }) {
	try {
		const buffer = await sharp(path).resize(500, 500).webp().toBuffer({ resolveWithObject: true });
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
