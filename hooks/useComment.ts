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
			const { data }: { data: apiResponse<commentResType[]> } = await HTTPService.get(staticURLs.server.feed.comment.base, {
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
			fetcher: () => HTTPService.post(staticURLs.server.feed.comment.base, body),
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

	async function onDelete({ id }: { id: number }) {
		await commentMutator(
			async () => {
				try {
					const { data }: { data: apiResponse<commentResType> } = await HTTPService.patch(
						staticURLs.server.feed.comment.base,
						{ id }
					);
					if (data.resState === responseState.ok) return data.data as any;
					toast.warn("some problem");
					throw 500;
				} catch (error) {
					throw 500;
				}
			},
			{
				optimisticData: (_currentData) => {
					return commentInfo?.filter((comment) => comment.id !== id);
				},

				populateCache: (res, _baseState) => {
					return commentInfo?.filter((comment) => comment.id !== res.id);
				},

				rollbackOnError: true,
				throwOnError: false,
				revalidate: false,
			}
		);
	}

	return { isLoading, commentInfo, isValidating, addComment, onDelete };
}
