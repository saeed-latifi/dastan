export enum responseState {
	ok = 1,
	error = 3,
	notValid = 2,
}

export interface iValidationWarnings {
	name: string;
	message: string;
}

export type apiResponse<T> =
	| { resState: responseState.ok; data: T | T[] }
	| { resState: responseState.error; error: string }
	| { resState: responseState.notValid; warnings: iValidationWarnings[] };

export function onSuccessResponse<T>(data: T | T[]): apiResponse<T> {
	return { resState: responseState.ok, data };
}

export function onErrorResponse<T>(error: string): apiResponse<T> {
	return { resState: responseState.error, error };
}

export function onNotValidResponse<T>(warnings: iValidationWarnings[]): apiResponse<T> {
	return { resState: responseState.notValid, warnings };
}

export default function zodErrorMapper<T>(issues: any): apiResponse<T> {
	const mappedErrors = issues.map((error: any) => {
		return {
			name: error.path[0],
			message: error.message,
		};
	});

	return {
		resState: responseState.notValid,
		warnings: mappedErrors,
	};
}
