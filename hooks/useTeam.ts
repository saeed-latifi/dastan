import HTTPService from "@providers/HTTPService";
import { apiResponse, responseState } from "@providers/apiResponseHandler";
import { toast } from "react-toastify";
import useSWR from "swr";
import { errorMutateHandler, fetchHandler, okMutateHandler } from "./useFetch";
import { useRouter } from "next/router";
import { teamLimits } from "statics/limits";

export function useTeam() {
	const router = useRouter();

	const {
		data: teamsInfo,
		mutate: teamsMutate,
		isLoading,
	} = useSWR("userTeams", getTeams, {
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
	});

	async function getTeams() {
		try {
			const { data }: { data: apiResponse<any[]> } = await HTTPService.get("team");
			if (data.resState === responseState.ok) {
				return data.data;
			}
		} catch (error: any) {
			toast.warn("bad connection");
			throw "bad connection";
		}
	}

	function onAddTeam(body: { title: string; description: string; userId: number; contactMethods?: string[] }) {
		// TODO MUTATE
		fetchHandler({
			fetcher: () => HTTPService.post("team", body),
			onOK: (res) => {
				// router.push("/team");
				console.log(res.data);
			},
		});
	}

	function onUpdateTeam(body: { id: number; title?: string; description?: string; contactMethods?: string[] }) {
		// TODO MUTATE
		fetchHandler({
			fetcher: () => HTTPService.put("team", body),
			onOK: (res) => {
				// router.push("/team");
				console.log(res.data);
			},
		});
	}

	const allowMoreTeam = () => {
		if (isLoading) return false;
		if (teamsInfo && teamsInfo.length >= teamLimits.number) return false;
		return true;
	};

	return { teamsInfo, onAddTeam, onUpdateTeam, isLoading, allowMoreTeam };
}
