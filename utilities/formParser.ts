import formidable from "formidable";
import { NextApiRequest } from "next";

export async function formParser(req: NextApiRequest) {
	return new Promise<{ fields: any; files: any }>((resolve, reject) => {
		const form = formidable();
		form.parse(req, function (err, fields, files) {
			if (err) {
				reject(err);
			}
			resolve({ fields, files });
		});
	});
}
