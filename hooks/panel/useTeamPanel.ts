import HTTPService from "@providers/HTTPService";
import { apiResponse, responseState } from "@providers/apiResponseHandler";
import { toast } from "react-toastify";
import useSWR from "swr";
import { fetchHandler } from "../useFetch";
import { useRouter } from "next/router";
import { jobLimits, teamLimits } from "statics/measures";
import { produce } from "immer";
import { iJobCreate, iJobUpdate } from "@models/iJob";
import { staticURLs } from "statics/url";
import { teamImageRes, teamPanelResType } from "@providers/prismaProviders/teamPrisma";
import { jobPanelResType } from "@providers/prismaProviders/jobPrisma";
import { useImage } from "@hooks/useImage";

export function useTeamPanel() {
	const router = useRouter();
	const { forceImageParam, onIncrease } = useImage();

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
			const { data }: { data: apiResponse<teamPanelResType[]> } = await HTTPService.get(staticURLs.server.panel.team.base);
			if (data.resState === responseState.ok) return data.data;
		} catch (error: any) {
			toast.warn("bad connection");
		}
	}

	function onAddTeam(body: { title: string; description: string; userId: number; contactMethods?: string[] }) {
		fetchHandler<teamPanelResType>({
			fetcher: () => HTTPService.post(staticURLs.server.panel.team.base, body),
			onOK: (res) => {
				teamsMutate(undefined, {
					populateCache(_result, baseState) {
						const mutated = produce(baseState, (draft) => {
							if (Array.isArray(draft)) draft.push(res);
							else draft = [res];
						});
						return mutated;
					},
					revalidate: false,
				});
				router.push(staticURLs.client.panel.team.all);
			},
		});
	}

	function onUpdateTeam(body: { id: number; title?: string; description?: string; contactMethods?: string[] }) {
		fetchHandler<teamPanelResType>({
			fetcher: () => HTTPService.put(staticURLs.server.panel.team.base, body),
			onOK: (res) => {
				teamsMutate(undefined, {
					populateCache(_result, baseState) {
						const mutated = produce(baseState, (draft) => {
							draft?.forEach((item, index) => {
								if (item.id === res.id) draft[index] = { ...res };
							});
						});
						return mutated;
					},
					revalidate: false,
				});
				router.push(staticURLs.client.panel.team.all);
			},
		});
	}

	function onAddJob(body: iJobCreate) {
		fetchHandler<jobPanelResType>({
			fetcher: () => HTTPService.post(staticURLs.server.panel.job.base, body),
			onOK: (res) => {
				let itemId = 0;
				teamsMutate(undefined, {
					populateCache(_result, baseState) {
						const mutated = produce(baseState, (draft) => {
							draft?.forEach((team) => {
								if (team.id === res.teamId) {
									itemId = res.teamId;
									if (Array.isArray(team.jobs)) team.jobs.push(res);
									else team.jobs = [res];
								}
							});
						});
						return mutated;
					},
					revalidate: false,
				});
				router.push(staticURLs.client.panel.team.one({ teamId: itemId }));
			},
		});
	}

	function onUpdateJob(body: iJobUpdate) {
		fetchHandler<jobPanelResType>({
			fetcher: () => HTTPService.put(staticURLs.server.panel.job.base, body),
			onOK: (res) => {
				let itemId = 0;
				teamsMutate(undefined, {
					populateCache(_result, baseState) {
						const mutated = produce(baseState, (draft) => {
							draft?.forEach((team) => {
								if (team.id === res.teamId) {
									if (Array.isArray(team.jobs)) {
										team.jobs.forEach((job: any, index: number) => {
											if (job.id === res.id) {
												itemId = res.teamId;
												team.jobs[index] = { ...res };
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
				router.push(staticURLs.client.panel.team.one({ teamId: itemId }));
			},
		});
	}

	async function onUpdateTeamLogo({ formData }: { formData: FormData }) {
		try {
			const { data }: { data: apiResponse<teamImageRes> } = await HTTPService.post(staticURLs.server.panel.team.image, formData);
			if (data.resState === responseState.ok) {
				onIncrease();
				teamsMutate(undefined, {
					populateCache(_result, baseState) {
						const mutated = produce(baseState, (draft) => {
							if (draft) {
								draft.forEach((team) => {
									if (team.id === data.data.id) {
										team.image = data.data.image;
									}
								});
							}
						});
						return mutated;
					},
					revalidate: false,
				});
				router.push(staticURLs.client.panel.team.all);
				return toast.success("image uploaded.");
			} else {
				return toast.warn("image upload failed!");
			}
		} catch (error) {
			return toast.warn("image upload failed!");
		}
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
			if (item.id === teamId && item?.jobs.length >= jobLimits.number) {
				allow = false;
			}
		});
		return allow;
	};

	return { isLoading, teamsInfo, onAddTeam, onUpdateTeam, allowMoreTeam, onAddJob, onUpdateJob, allowMoreJob, onUpdateTeamLogo };
}
