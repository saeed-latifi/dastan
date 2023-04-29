import { readdir, mkdir } from "fs/promises";
import path from "path";

const publicPath = path.resolve("/public");
// const imagesPath = path.join(publicPath, "images");
const imagesPath = path.resolve("/images");
export const profileImagesPath = path.join(imagesPath, "profile");

export default async function directoryHandler() {
	// step one public
	try {
		await readdir(publicPath);
	} catch (error) {
		await mkdir(publicPath);
	}

	// step two images
	try {
		await readdir(imagesPath);
	} catch (error) {
		await mkdir(imagesPath);
	}

	// step three profile
	try {
		await readdir(profileImagesPath);
	} catch (error) {
		await mkdir(profileImagesPath);
	}
}
