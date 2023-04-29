export default function nullPurger(data: any) {
	if (typeof data === "object" && data !== null) {
		const newObj = { ...data };
		for (let [key, value] of Object.entries(newObj)) {
			if (value === null) {
				delete newObj[key];
			}
		}
		return newObj;
	}
	return data;
}
