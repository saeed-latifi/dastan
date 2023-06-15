import HTTPService from "@providers/HTTPService";
import { apiResponse, responseState } from "@providers/apiResponseHandler";
import { commentResType } from "@providers/prismaProviders/commentPrisma";
import { toast } from "react-toastify";
import { staticURLs } from "statics/url";
import useSWR from "swr";
import { fetchHandler } from "./useFetch";
import { produce } from "immer";
import { iCommentCreate } from "@models/iComment";
export function useComment({ contentId }: { contentId?: number }) {
	const {
		data: commentInfo,
		mutate: commentMutator,
		isLoading,
		isValidating,
	} = useSWR(keyGenerator(), getComment, {
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
	});

	function keyGenerator() {
		return contentId ? `comment,${contentId}` : "comment";
	}

	async function getComment(key: string) {
		const contentId = key.split(",")[1];
		if (!contentId) return;

		try {
			const { data }: { data: apiResponse<commentResType[]> } = await HTTPService.get(staticURLs.server.feed.comment, {
				params: { contentId },
			});
			console.log("comments :: ", data);

			if (data.resState === responseState.ok) return data.data;
		} catch (error: any) {
			toast.warn("bad connection");
		}
	}

	async function addComment(body: iCommentCreate) {
		fetchHandler<commentResType>({
			fetcher: () => HTTPService.post(staticURLs.server.feed.comment, body),
			onOK: (res) => {
				commentMutator(undefined, {
					populateCache(_result, _baseState) {
						const mutated = produce(commentInfo, (draft) => {
							if (!draft) {
								draft = [res];
							} else {
								draft.push(res);
							}
						});
						return mutated;
					},
					revalidate: false,
				});
			},
		});
	}

	return { isLoading, commentInfo, isValidating, addComment };
}
