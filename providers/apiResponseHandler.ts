export enum responseState {
	ok = 1,
	error = 2,
}

// export type errorType = { [key: string]: string };
export type errorType = { [T in string]: string };
export type apiResponse<T> = { resState: responseState.ok; data: T } | { resState: responseState.error; errors: errorType };

export function onSuccessResponse<T>(data: T): apiResponse<T> {
	return { resState: responseState.ok, data };
}

export function onErrorResponse<T>(errors: string | errorType): apiResponse<T> {
	if (typeof errors === "string") {
		return { resState: responseState.error, errors: { base: errors } };
	}
	return { resState: responseState.error, errors };
}

export function onZodErrorResponse<T>(issues: any): apiResponse<T> {
	const mappedErrors: errorType = {};
	issues.map((error: any) => {
		mappedErrors[error.path[0]] = error.message;
	});

	return {
		resState: responseState.error,
		errors: mappedErrors,
	};
}
