// import { iCreateAdminTicket, iUpdateAdminTicket } from "@models/iAdminTicket";
import { iPagination } from "@models/iPagination";
import HTTPService, { takeNumber } from "@providers/HTTPService";
import { apiResponse, responseState } from "@providers/apiResponseHandler";
import { adminTicketType } from "@providers/prismaProviders/ticketPrisma";
import { toast } from "react-toastify";
import { staticURLs } from "statics/url";
import useSWRInfinite from "swr/infinite";

export function useAdminTickets() {
	function keyGenerator(pageIndex: number, _previousPageData: any) {
		return `adminTickets,${pageIndex}`;
	}

	const options = {
		revalidateFirstPage: false,
		revalidateAll: false,
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
		// revalidateOnMount: false,
	};

	const { data: ticketsInfo, isLoading, isValidating, size, setSize, mutate } = useSWRInfinite(keyGenerator, getTickets, { ...options });

	async function getTickets(key: string) {
		const pageNumber = parseInt(key.split(",")[1]);
		if (!pageNumber && pageNumber !== 0) return;
		const body: iPagination = { take: takeNumber, skip: pageNumber * takeNumber };

		try {
			const { data }: { data: apiResponse<{ items: adminTicketType[]; count: number }> } = await HTTPService.put(
				staticURLs.server.admin.tickets.base,
				body
			);
			if (data.resState === responseState.ok) return data.data;
		} catch (error: any) {
			toast.warn("bad connection");
		}
	}

	function hasMore() {
		if (ticketsInfo && ticketsInfo[0]?.count && !isValidating && size * takeNumber < ticketsInfo[0]?.count) return true;
		return false;
	}

	return {
		isLoading: isLoading,
		isValidating,
		tickets: ticketsInfo,
		setPage: setSize,
		size,
		hasMore: hasMore(),
	};
}
