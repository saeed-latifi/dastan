import HTTPService from "@providers/HTTPService";
import { apiResponse, responseState } from "@providers/apiResponseHandler";
import { commentResType } from "@providers/prismaProviders/commentPrisma";
import { toast } from "react-toastify";
import { staticURLs } from "statics/url";
import useSWR from "swr";
import { fetchHandler } from "./useFetch";
import { produce } from "immer";
import { iCommentCreate, iCommentUpdate } from "@models/iComment";
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
	type getType = { data: apiResponse<commentResType[]> };
	async function getComment(key: string) {
		const contentId = key.split(",")[1];
		if (!contentId) return;
		try {
			const { data }: getType = await HTTPService.get(staticURLs.server.feed.comment.base, { params: { contentId } });
			if (data.resState === responseState.ok) return data.data;
		} catch (error: any) {
			toast.warn("bad connection");
		}
	}

	async function getReplies({ id }: { id: number }) {
		try {
			const { data }: getType = await HTTPService.delete(staticURLs.server.feed.comment.base, { params: { parentId: id } });
			if (data.resState === responseState.ok) {
				commentMutator(undefined, {
					populateCache(_result, _baseState) {
						if (commentInfo) {
							const mutated = commentInfo.map((comment) => {
								if (comment.id === id) {
									const newComment = { ...comment };
									newComment.children = data.data;
									return newComment;
								}
								return comment;
							});
							return mutated;
						}
					},
					revalidate: false,
				});
			}
		} catch (error) {
			return toast.warn("bad network try again");
		}
	}

	async function addComment(body: iCommentCreate) {
		fetchHandler<commentResType>({
			fetcher: () => HTTPService.post(staticURLs.server.feed.comment.base, body),
			onOK: (res) => {
				commentMutator(undefined, {
					populateCache(_result, _baseState) {
						const mutated = produce(commentInfo, (draft) => {
							if (body.replyId) {
								draft?.forEach((comment) => {
									if (comment.id === res.parentId) {
										if (comment.children) comment.children.push(res);
										else comment.children = [res];
									}
								});
							} else {
								if (!draft) draft = [res];
								else draft.push(res);
							}
						});
						return mutated;
					},
					revalidate: false,
				});
			},
		});
	}

	async function updateComment(body: iCommentUpdate, parentId?: number) {
		await commentMutator(
			async () => {
				try {
					const { data }: { data: apiResponse<commentResType> } = await HTTPService.put(
						staticURLs.server.feed.comment.base,
						body
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
					if (parentId) {
						return commentInfo?.map((comment) => {
							if (comment.id === parentId && comment.children) {
								const children = comment.children.map((child) => {
									if (child.id === body.id) {
										child = { ...child };
										child.description = body.description;
									}
									return child;
								});
								comment = { ...comment, children };
							}
							return comment;
						});
					} else {
						return commentInfo?.map((comment) => {
							if (comment.id === body.id) {
								comment = { ...comment };
								comment.description = body.description;
							}
							return comment;
						});
					}
				},

				populateCache: (res: commentResType, _baseState) => {
					if (parentId) {
						return commentInfo?.map((comment) => {
							if (comment.id === res.parentId && comment.children) {
								const children = comment.children.map((child) => {
									if (child.id === res.id) child = res;
									return child;
								});
								comment = { ...comment, children };
							}
							return comment;
						});
					} else {
						return commentInfo?.map((comment) => {
							if (comment.id === res.id) {
								comment = { ...comment };
								comment.description = res.description;
							}

							return comment;
						});
					}
				},

				rollbackOnError: true,
				throwOnError: false,
				revalidate: false,
			}
		);
	}

	async function onDelete({ id, parentId }: { id: number; parentId?: number }) {
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

	return { isLoading, commentInfo, isValidating, addComment, onDelete, updateComment, getReplies };
}
