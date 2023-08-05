import { iCreateAdminMessage, iUpdateAdminMessage } from "@models/iAdminMessage";
import { iPagination } from "@models/iPagination";
import HTTPService, { takeNumber } from "@providers/HTTPService";
import { apiResponse, responseState } from "@providers/apiResponseHandler";
import { AdminMessageResType } from "@providers/prismaProviders/adminMessagePrisma";
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

	const { data: messagesInfo, isLoading, isValidating, size, setSize, mutate } = useSWRInfinite(keyGenerator, getMessages, { ...options });

	async function getMessages(key: string) {
		const pageNumber = parseInt(key.split(",")[1]);
		if (!pageNumber && pageNumber !== 0) return;
		const body: iPagination = { take: takeNumber, skip: pageNumber * takeNumber };

		try {
			const { data }: { data: apiResponse<{ messages: AdminMessageResType[]; count: number }> } = await HTTPService.put(
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
			const { data }: { data: apiResponse<AdminMessageResType> } = await HTTPService.post(staticURLs.server.admin.messages.base, body);

			if (data.resState === responseState.ok) {
				toast.success("message sended.");
				mutate(undefined, {
					populateCache(_result, _baseState) {
						const newPagesArr: { messages: AdminMessageResType[]; count: number }[] = [];
						messagesInfo?.forEach((page) => page && newPagesArr.push(page));
						if (newPagesArr[0]) newPagesArr[0].messages.unshift(data.data);
						return newPagesArr;
					},
					revalidate: false,
				});
				return data.data;
			} else {
				toast.warn(data.errors[0]);
			}
		} catch (error: any) {
			toast.warn("bad connection");
		}
	}

	async function updateMessage(body: iUpdateAdminMessage) {
		try {
			const { data }: { data: apiResponse<AdminMessageResType> } = await HTTPService.patch(staticURLs.server.admin.messages.base, body);

			if (data.resState === responseState.ok) {
				toast.success("message updated.");
				mutate(undefined, {
					populateCache(_result, _baseState) {
						const newPagesArr: { messages: AdminMessageResType[]; count: number }[] = [];
						messagesInfo?.forEach(
							(page) =>
								page &&
								newPagesArr.push({
									count: page.count,
									messages: page.messages.map((message) => {
										if (message.id === data.data.id) message = data.data;
										return message;
									}),
								})
						);
						return newPagesArr;
					},
					revalidate: false,
				});
				return data.data;
			} else {
				toast.warn(data.errors.base);
			}
		} catch (error: any) {
			toast.warn("bad connection");
		}
	}

	function hasMore() {
		if (messagesInfo && messagesInfo[0]?.count && !isValidating && size * takeNumber < messagesInfo[0]?.count) return true;
		return false;
	}

	return {
		isLoading: isLoading,
		isValidating,
		messages: messagesInfo,
		setPage: setSize,
		size,
		hasMore: hasMore(),
		sendMessage,
		updateMessage,
	};
}
