export function excluder<Obj, Key extends keyof Obj>(obj: Obj, keys: Key[]): Omit<Obj, Key> {
	for (let key of keys) {
		delete obj[key];
	}
	return obj;
}
