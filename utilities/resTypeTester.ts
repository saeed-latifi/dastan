import { apiResponse, responseState } from "@providers/apiResponseHandler";

export default function sleep(ms: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

export async function testOkRes<T>(data: T): Promise<apiResponse<T>> {
	await sleep(1000);
	return {
		resState: responseState.ok,
		data,
	};
}

export async function testErrorRes<T>(): Promise<apiResponse<T>> {
	await sleep(1000);
	return {
		resState: responseState.error,
		errors: { test: "it is a test error" },
	};
}
