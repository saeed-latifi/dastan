import HTTPService from "@providers/HTTPService";
import { apiResponse, responseState } from "@providers/apiResponseHandler";
import { toast } from "react-toastify";
import useSWR from "swr";
import { staticURLs } from "statics/url";
import { useRouter } from "next/router";
import { teamFeedResType } from "@providers/prismaProviders/teamPrisma";

export function useTeamFeed() {
	const router = useRouter();
	const id = router.query.id;
	const options = {
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
	};

	const { data: teamInfo, isLoading, isValidating } = useSWR(id ? `teamFeed,${id}` : undefined, getCourses, options);

	async function getCourses() {
		if (!id) return;
		try {
			const { data }: { data: apiResponse<teamFeedResType> } = await HTTPService.get(
				staticURLs.server.feed.team(parseInt(id as string))
			);
			if (data.resState === responseState.ok) return data.data;
		} catch (error: any) {
			toast.warn("bad connection");
		}
	}

	return { isLoading: isLoading || !id, teamInfo, isValidating };
}
