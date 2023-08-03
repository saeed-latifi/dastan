import { iPagination } from "@models/iPagination";
import HTTPService, { takeNumber } from "@providers/HTTPService";
import { apiResponse, responseState } from "@providers/apiResponseHandler";
import { AdminMessageResType } from "@providers/prismaProviders/adminMessagePrisma";
import { toast } from "react-toastify";
import { staticURLs } from "statics/url";
import useSWRInfinite from "swr/infinite";

export function usePanelAdminMessages() {
	function keyGenerator(pageIndex: number, _previousPageData: any) {
		return `panelAdminMessages,${pageIndex}`;
	}

	const options = {
		revalidateFirstPage: false,
		revalidateAll: false,
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
		// revalidateOnMount: false,
	};

	const { data, isLoading, isValidating, size, setSize } = useSWRInfinite(keyGenerator, getMessages, { ...options });

	async function getMessages(key: string) {
		const pageNumber = parseInt(key.split(",")[1]);
		if (!pageNumber && pageNumber !== 0) return;
		const body: iPagination = { take: takeNumber, skip: pageNumber * takeNumber };

		try {
			const { data }: { data: apiResponse<{ messages: AdminMessageResType[]; count: number }> } = await HTTPService.post(
				staticURLs.server.account.adminMessage.base,
				body
			);
			if (data.resState === responseState.ok) return data.data;
		} catch (error: any) {
			toast.warn("bad connection");
		}
	}

	function hasMore() {
		if (data && data[0]?.count && !isValidating && size * takeNumber < data[0]?.count) return true;
		return false;
	}

	return { isLoading: isLoading, isValidating, messages: data, setPage: setSize, size, hasMore: hasMore() };
}
