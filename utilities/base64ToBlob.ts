export default async function base64ToBlob(dataUrl: string): Promise<Blob> {
	let newImage = new Image();
	return new Promise((resolve, reject) => {
		// newImage.onload = () => resolve(elem);
		newImage.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = newImage.width;
			canvas.height = newImage.height;
			const ctx = canvas.getContext("2d");
			ctx?.drawImage(newImage, 0, 0);
			canvas.toBlob(
				(blob: Blob | null) => {
					if (blob) resolve(blob);
					else reject;
				},
				"image/jpeg",
				1
			);
		};
		newImage.onerror = reject;
		newImage.src = dataUrl;
	});
}
