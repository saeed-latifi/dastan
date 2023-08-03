import { iPagination } from "@models/iPagination";
import HTTPService, { takeNumber } from "@providers/HTTPService";
import { apiResponse, responseState } from "@providers/apiResponseHandler";
import { userAdminResType } from "@providers/prismaProviders/userPrisma";
import { toast } from "react-toastify";
import { staticURLs } from "statics/url";
import useSWRInfinite from "swr/infinite";

export function useAdminUsers() {
	function keyGenerator(pageIndex: number, _previousPageData: any) {
		return `adminUsers,${pageIndex}`;
	}

	const options = {
		revalidateFirstPage: false,
		revalidateAll: false,
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
		// revalidateOnMount: false,
	};

	const { data, isLoading, isValidating, size, setSize } = useSWRInfinite(keyGenerator, getAdminUsers, { ...options });

	async function getAdminUsers(key: string) {
		const pageNumber = parseInt(key.split(",")[1]);
		if (!pageNumber && pageNumber !== 0) return;
		const body: iPagination = { take: takeNumber, skip: pageNumber * takeNumber };

		try {
			const { data }: { data: apiResponse<{ users: userAdminResType[]; count: number }> } = await HTTPService.post(
				staticURLs.server.admin.users.base,
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

	return { isLoading, isValidating, users: data, setPage: setSize, size, hasMore: hasMore() };
}
