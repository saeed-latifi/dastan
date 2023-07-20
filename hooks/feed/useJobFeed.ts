import { WageType } from "@prisma/client";
import HTTPService, { takeNumber } from "@providers/HTTPService";
import { apiResponse, responseState } from "@providers/apiResponseHandler";
import { jobFeedResType } from "@providers/prismaProviders/jobPrisma";
import { toast } from "react-toastify";
import { staticURLs } from "statics/url";
import useSWRInfinite from "swr/infinite";
import { iJobFeed } from "@models/iJob";

type argsType = { categoryId?: number; wageType?: WageType; wage?: number; provinceId?: number };

export function useJobFeed({ categoryId, provinceId, wage, wageType }: argsType) {
	function keyGenerator(pageIndex: number, previousPageData: any) {
		return `job,${pageIndex}`;
	}

	const options = {
		revalidateFirstPage: false,
		revalidateAll: false,
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
		// revalidateOnMount: false,
	};

	const { data: jobsInfo, isLoading, isValidating, size, setSize } = useSWRInfinite(keyGenerator, getJobs, { ...options });

	async function getJobs(key: string) {
		const pageNumber = parseInt(key.split(",")[1]);
		if (!pageNumber && pageNumber !== 0) return;
		const body: iJobFeed = { take: takeNumber, skip: pageNumber * takeNumber };

		try {
			const { data }: { data: apiResponse<jobFeedResType> } = await HTTPService.put(staticURLs.server.feed.jobs, body);
			if (data.resState === responseState.ok) return data.data;
		} catch (error: any) {
			toast.warn("bad connection");
		}
	}

	function hasMore() {
		if (jobsInfo && jobsInfo[0]?.count && !isValidating && size * takeNumber < jobsInfo[0]?.count) return true;
		return false;
	}

	return { isLoading: isLoading, isValidating, jobsInfo, setPage: setSize, size, hasMore: hasMore() };
}
