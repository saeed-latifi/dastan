import HTTPService from "@providers/HTTPService";
import { apiResponse, responseState } from "@providers/apiResponseHandler";
import { toast } from "react-toastify";
import useSWR from "swr";
import { produce } from "immer";
import { staticURLs } from "statics/url";
import { coursePublicResType } from "@providers/prismaProviders/coursePrisma";
import { iLike } from "@models/iLike";
import { Like } from "@prisma/client";

export function useCourseFeed() {
	const {
		data: coursesInfo,
		mutate: coursesMutate,
		isLoading,
		isValidating,
	} = useSWR("feedCourses", getCourses, {
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
	});

	async function getCourses() {
		try {
			const { data }: { data: apiResponse<coursePublicResType[]> } = await HTTPService.get(staticURLs.server.feed.course.all);
			if (data.resState === responseState.ok) return data.data;
		} catch (error: any) {
			toast.warn("bad connection");
		}
	}

	async function onLikeCourse({ body: { isLike, contentId }, userId }: { body: iLike; userId: number }) {
		await coursesMutate(
			async () => {
				try {
					const { data }: { data: apiResponse<Like> } = await HTTPService.post(staticURLs.server.feed.like, {
						isLike,
						contentId,
					});
					if (data.resState === responseState.ok) return data.data as any;
					toast.warn("some problem");
					throw 500;
				} catch (error) {
					throw 500;
				}
			},
			{
				optimisticData: (_currentData) => {
					const mutated = produce(coursesInfo, (draft) => {
						if (Array.isArray(draft)) {
							draft.forEach((course) => {
								if (course.content.id === contentId) {
									if (isLike) {
										course.content.likes[0] = {
											authorId: userId,
											contentId: contentId,
										};
										course.content._count.likes += 1;
									} else {
										course.content.likes = [];
										course.content._count.likes -= 1;
									}
								}
							});
						}
					});
					return mutated;
				},

				populateCache: (res, _baseState) => {
					// TODO extract for all likes
					const mutated = produce(coursesInfo, (draft) => {
						if (Array.isArray(draft)) {
							draft.forEach((course) => {
								if (course.content.id === res.contentId) {
									if (isLike) {
										course.content.likes[0] = {
											authorId: res.authorId,
											contentId: res.contentId,
										};
										course.content._count.likes += 1;
									} else {
										course.content.likes = [];
										course.content._count.likes -= 1;
									}
								}
							});
						}
					});

					return mutated;
				},

				rollbackOnError: true,
				throwOnError: false,
				revalidate: false,
			}
		);
	}

	return { isLoading, coursesInfo, onLikeCourse, isValidating };
}
