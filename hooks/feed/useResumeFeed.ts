import HTTPService from "@providers/HTTPService";
import { apiResponse, responseState } from "@providers/apiResponseHandler";
import { toast } from "react-toastify";
import useSWR from "swr";
import { produce } from "immer";
import { staticURLs } from "statics/url";
import { coursePublicResType } from "@providers/prismaProviders/coursePrisma";
import { iLike } from "@models/iLike";
import { Like } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { userFeedResType } from "@providers/prismaProviders/userPrisma";
import { userInfo } from "os";
import { iFollow } from "@models/iResume";
import { followResType } from "@providers/prismaProviders/resumePrisma";
import { useAccount } from "@hooks/useAccount";

export function useResumeFeed() {
	const router = useRouter();

	const { userInfo } = useAccount();

	useEffect(() => {}, [router]);

	function keyGenerator() {
		return router.query.username ? `resumeFeed,${router.query.username}` : "resumeFeed";
	}

	const {
		data: resumeInfo,
		mutate: resumeMutate,
		isLoading,
		isValidating,
	} = useSWR(keyGenerator(), getResume, {
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
	});

	async function getResume(key: string) {
		const username = key.split(",")[1];
		if (!username) return;

		try {
			const { data }: { data: apiResponse<userFeedResType> } = await HTTPService.get(staticURLs.server.feed.resume, {
				params: { username },
			});
			if (data.resState === responseState.ok) return data.data;
		} catch (error: any) {
			toast.warn("bad connection");
		}
	}

	async function onFollow(followedByMe: boolean) {
		if (!resumeInfo) return;
		const body: iFollow = { userId: resumeInfo.id };
		await resumeMutate(
			async () => {
				try {
					const { data }: { data: apiResponse<followResType> } = await HTTPService.post(staticURLs.server.feed.follow, body);
					if (data.resState === responseState.ok) return data.data as any;
					toast.warn("some problem");
					throw 500;
				} catch (error) {
					throw 500;
				}
			},
			{
				optimisticData: (_currentData) => {
					const mutated = produce(resumeInfo, (draft) => {
						if (followedByMe) {
							draft._count.followers -= 1;
							draft.followers = [];
						} else {
							draft._count.followers += 1;
							draft.followers = [{ id: userInfo.id }];
						}
					});

					console.log("optimisticData :: ", mutated);
					return mutated;
				},

				populateCache: (res: followResType, _baseState) => {
					const mutated = produce(resumeInfo, (draft) => {
						if (res.isFollowed) {
							draft._count.followers += 1;
							draft.followers = [{ id: res.userId }];
						} else {
							draft._count.followers -= 1;
							draft.followers = [];
						}
					});

					console.log("populateCache :: ", mutated);

					return mutated;
				},

				rollbackOnError: true,
				throwOnError: false,
				revalidate: false,
			}
		);
	}

	return { isLoading, resumeInfo, onFollow, isValidating };
}
