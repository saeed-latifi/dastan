import { apiResponse, responseState } from "@providers/apiResponseHandler";
import { produce } from "immer";
import { toast } from "react-toastify";
import { KeyedMutator } from "swr";

type fetchHandlerArgs<T> = {
	fetcher: () => any;
	onOK?: (data: T) => void;
	onError?: (...data: any) => void;
	okMessage?: string;
	errorMessage?: string;
};
export const fetchHandler = async <T>({ fetcher, onOK, onError, okMessage, errorMessage }: fetchHandlerArgs<T>) => {
	try {
		const { data }: { data: apiResponse<T> } = await fetcher();
		if (data.resState === responseState.error) {
			onError && onError(data.errors);
			for (const [_key, value] of Object.entries(data.errors)) {
				toast.warn(value);
			}
			return;
		}
		if (data.resState === responseState.ok) {
			onOK && onOK(data.data);
			return okMessage ? toast.success(okMessage) : toast.success("success!");
		}
	} catch (error) {
		return toast.warn("bad network try again");
	}
};

export const okMutateHandler = ({ data, mutator }: { data: any; mutator: KeyedMutator<any> }) => {
	mutator(data, {
		populateCache(result, _) {
			return result;
		},
		revalidate: false,
	});
};

export const errorMutateHandler = ({ error, mutator }: { error: any; mutator: KeyedMutator<any> }) => {
	mutator("", {
		populateCache(_, oldState) {
			return { ...oldState, error };
		},
		revalidate: false,
	});
};

export const errorPurgerMutateHandler = ({ errorKey, mutator }: { errorKey: string; mutator: KeyedMutator<any> }) => {
	mutator("", {
		populateCache(_, baseState) {
			return produce(baseState, (draft: any) => {
				if (draft.error) {
					delete draft.error[errorKey];
				}
			});
		},
		revalidate: false,
	});
};
