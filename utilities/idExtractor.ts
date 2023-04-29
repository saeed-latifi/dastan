export function idExtractor(arrayOfObjects: any[]): [{ id: number }] {
	const arrayOfId = [];
	for (const i in arrayOfObjects) {
		if (arrayOfObjects[i].id) {
			arrayOfId.push({ id: arrayOfObjects[i].id });
		} else {
			arrayOfId.push({ id: arrayOfObjects[i] });
		}
	}
	return arrayOfId as [{ id: number }];
}
