export function paramGenerator() {
	const date = new Date();
	const milliseconds = date.getTime();

	// TODO fix return to number shape
	return { value: milliseconds };
}
