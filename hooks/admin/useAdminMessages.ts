import { iCreateAdminMessage } from "@models/iAdminMessage";
import { iPagination } from "@models/iPagination";
import HTTPService, { takeNumber } from "@providers/HTTPService";
import { apiResponse, responseState } from "@providers/apiResponseHandler";
import { AdminMessagesResType, adminMessageResType } from "@providers/prismaProviders/adminMessagePrisma";
import { userAdminResType } from "@providers/prismaProviders/userPrisma";
import { toast } from "react-toastify";
import { staticURLs } from "statics/url";
import useSWRInfinite from "swr/infinite";

export function useAdminMessages() {
	function keyGenerator(pageIndex: number, _previousPageData: any) {
		return `adminMessages,${pageIndex}`;
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
			const { data }: { data: apiResponse<{ messages: AdminMessagesResType[]; count: number }> } = await HTTPService.put(
				staticURLs.server.admin.messages.base,
				body
			);
			if (data.resState === responseState.ok) return data.data;
		} catch (error: any) {
			toast.warn("bad connection");
		}
	}

	async function sendMessage(body: iCreateAdminMessage) {
		try {
			const { data }: { data: apiResponse<adminMessageResType> } = await HTTPService.post(staticURLs.server.admin.messages.base, body);
			console.log("data : ", data);

			if (data.resState === responseState.ok) return data.data;
		} catch (error: any) {
			toast.warn("bad connection");
		}
	}

	function hasMore() {
		if (data && data[0]?.count && !isValidating && size * takeNumber < data[0]?.count) return true;
		return false;
	}

	return {
		isLoading: isLoading,
		isValidating,
		messages: data,
		setPage: setSize,
		size,
		hasMore: hasMore(),
		sendMessage,
	};
}
