import { WageType } from "@prisma/client";
import HTTPService from "@providers/HTTPService";
import { apiResponse, responseState } from "@providers/apiResponseHandler";
import { jobPanelResType } from "@providers/prismaProviders/jobPrisma";
import { toast } from "react-toastify";
import { staticURLs } from "statics/url";
import useSWR from "swr";

type argsType = { categoryId?: number; wageType?: WageType; wage?: number; provinceId?: number };
export function useJobFeed({ categoryId, provinceId, wage, wageType }: argsType) {
	const {
		data: jobsInfo,
		mutate,
		isLoading,
		isValidating,
	} = useSWR(generateKey(), getJobs, {
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
	});
	function generateKey() {
		return `feedJobs,${categoryId},${provinceId},${wage},${wageType}`;
	}

	async function getJobs() {
		try {
			const { data }: { data: apiResponse<jobPanelResType[]> } = await HTTPService.get(staticURLs.server.feed.jobs);
			if (data.resState === responseState.ok) return data.data;
		} catch (error: any) {
			toast.warn("bad connection");
		}
	}

	return { isLoading: isLoading || isValidating, jobsInfo };
}
