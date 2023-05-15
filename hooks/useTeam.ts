import HTTPService from "@providers/HTTPService";
import { apiResponse, responseState } from "@providers/apiResponseHandler";
import { toast } from "react-toastify";
import useSWR from "swr";
import { fetchHandler } from "./useFetch";
import { useRouter } from "next/router";
import { jobLimits, teamLimits } from "statics/limits";
import { produce } from "immer";
import { iJobCreate, iJobUpdate } from "@models/iJob";

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
			if (data.resState === responseState.ok) return data.data;
		} catch (error: any) {
			toast.warn("bad connection");
		}
	}

	function onAddTeam(body: { title: string; description: string; userId: number; contactMethods?: string[] }) {
		fetchHandler({
			fetcher: () => HTTPService.post("team", body),
			onOK: (res) => {
				teamsMutate(res.data, {
					populateCache(result, baseState) {
						const mutated = produce(baseState, (draft) => {
							if (Array.isArray(draft)) draft.push(result);
							else draft = [result];
						});
						return mutated;
					},
					revalidate: false,
				});
				router.push("/team");
			},
		});
	}

	function onUpdateTeam(body: { id: number; title?: string; description?: string; contactMethods?: string[] }) {
		fetchHandler({
			fetcher: () => HTTPService.put("team", body),
			onOK: (res) => {
				teamsMutate(res.data, {
					populateCache(result, baseState) {
						const mutated = produce(baseState, (draft) => {
							draft?.forEach((item, index) => {
								if (item.id === result.id) draft[index] = { ...result };
							});
						});
						return mutated;
					},
					revalidate: false,
				});
				router.push("/team");
			},
		});
	}

	function onAddJob(body: iJobCreate) {
		fetchHandler({
			fetcher: () => HTTPService.post("job", body),
			onOK: (res) => {
				let itemId = 0;
				teamsMutate(res.data, {
					populateCache(result, baseState) {
						const mutated = produce(baseState, (draft) => {
							draft?.forEach((team) => {
								if (team.id === result.teamId) {
									itemId = result.teamId;
									if (Array.isArray(team.Jobs)) team.Jobs.push(result);
									else team.Jobs = [result];
								}
							});
						});
						return mutated;
					},
					revalidate: false,
				});
				router.push(`/team/modify?item=${itemId}`);
			},
		});
	}

	function onUpdateJob(body: iJobUpdate) {
		fetchHandler({
			fetcher: () => HTTPService.put("job", body),
			onOK: (res) => {
				let itemId = 0;
				teamsMutate(res.data, {
					populateCache(result, baseState) {
						const mutated = produce(baseState, (draft) => {
							draft?.forEach((team) => {
								if (team.id === result.teamId) {
									if (Array.isArray(team.Jobs)) {
										team.Jobs.forEach((job: any, index: number) => {
											if (job.id === result.id) {
												itemId = result.teamId;
												team.Jobs[index] = { ...result };
											}
										});
									}
								}
							});
						});
						return mutated;
					},
					revalidate: false,
				});
				router.push(`/team/modify?item=${itemId}`);
			},
		});
	}

	const allowMoreTeam = () => {
		if (isLoading) return false;
		if (teamsInfo && teamsInfo.length >= teamLimits.number) return false;
		return true;
	};

	const allowMoreJob = (teamId: number) => {
		if (isLoading) return false;
		let allow = true;
		teamsInfo?.forEach((item) => {
			if (item.id === teamId && item?.Jobs.length >= jobLimits.number) {
				allow = false;
			}
		});
		return allow;
	};

	return { isLoading, teamsInfo, onAddTeam, onUpdateTeam, allowMoreTeam, onAddJob, onUpdateJob, allowMoreJob };
}
