import HTTPService from "@providers/HTTPService";
import { responseState } from "@providers/apiResponseHandler";
import { paramGenerator } from "@utilities/paramGenerator";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { staticURLs } from "statics/url";
import useSWR from "swr";

export function useImage() {
	const router = useRouter();
	const {
		data: forceImageParam,
		mutate: imgParamMutate,
		isLoading,
	} = useSWR("forceChangeImageParam", paramGenerator, {
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
	});

	function onIncrease() {
		imgParamMutate(paramGenerator, {
			populateCache(result, _) {
				return result;
			},
			revalidate: false,
		});
	}

	// TODO fix return to number shape
	return { forceImageParam: forceImageParam ? forceImageParam : 0, isLoading, onIncrease };
}
