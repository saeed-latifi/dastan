import { WageType } from "@prisma/client";
import HTTPService, { takeNumber } from "@providers/HTTPService";
import { apiResponse, responseState } from "@providers/apiResponseHandler";
import { jobFeedResType, jobFeedType } from "@providers/prismaProviders/jobPrisma";
import { toast } from "react-toastify";
import { staticURLs } from "statics/url";
import { iJobFeedById } from "@models/iJob";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function useOneJobFeed() {
	const router = useRouter();

	useEffect(() => {}, [router]);

	function keyGenerator() {
		if (router.query.jobId) return `oneJob/${router.query.jobId}`;
		return "oneJob";
	}

	const {
		data: jobInfo,
		isLoading,
		isValidating,
	} = useSWR(keyGenerator(), getJob, { revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false });

	async function getJob(body: iJobFeedById) {
		if (!router.query.jobId) return;
		const id = parseInt(router.query.jobId as string);
		try {
			const { data }: { data: apiResponse<jobFeedType> } = await HTTPService.patch(staticURLs.server.feed.jobs, { id });
			if (data.resState === responseState.ok) return data.data;
		} catch (error: any) {
			toast.warn("bad connection");
		}
	}

	return { isLoading, isValidating, jobInfo };
}
