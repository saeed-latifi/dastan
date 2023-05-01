export function paramGenerator() {
	const date = new Date();
	const milliseconds = date.getTime();
	return milliseconds;
}
