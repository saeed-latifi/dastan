import DateFormatter from "@components/dateFormatter";
import DeleteIcon from "@components/icons/delete-icon";
import EditIcon from "@components/icons/edit-icon";
import ReplyIcon from "@components/icons/reply-icon";
import { useAccount } from "@hooks/useAccount";
import { commentResType } from "@providers/prismaProviders/commentPrisma";
import onFocus from "@utilities/onFocus";
import Link from "next/link";
import React from "react";
import { staticURLs } from "statics/url";

export type commentEditType = { description: string; id: number; parentId?: number };
export type commentReplyType = { parentId?: number; id: number; authorName: string };

type onEditType = ({ id, description, parentId }: commentEditType) => void;
type onReplyType = ({ id, parentId, authorName }: commentReplyType) => void;
type onDeleteType = ({ id, parentId }: { id: number; parentId?: number }) => any;
type onGetRepliesType = ({ id }: { id: number }) => void;

type propsType = {
	comment: commentResType;
	onEdit?: onEditType;
	onReply?: onReplyType;
	onDelete?: onDeleteType;
	onGetReplies?: onGetRepliesType;
	isReply?: boolean;
	focusId?: string;
};

export default function CommentCard({ comment, isReply, onEdit, onReply, onDelete, onGetReplies, focusId }: propsType) {
	const { userInfo } = useAccount();
	const { author, contentId, createdAt, description, id, parentId, replyId, updatedAt, reply, children, _count } = comment;

	return (
		<div
			key={comment.id}
			className={`border-t  py-2 px-1  flex flex-col gap-1 ${
				isReply ? " ml-2 border-theme-warn " : "border-theme-form first:border-t-0 pt-4 first:pt-0"
			}`}
		>
			<p className="flex items-center justify-between gap-2">
				<Link href={staticURLs.client.feed.resume({ username: author.username })}>{author.username}</Link>
				<span className="flex-1"></span>
				{reply?.author.username && <span>reply to </span>}
				{reply?.author.username && <span>{reply?.author.username}</span>}
			</p>
			<p>{description}</p>
			<p className="flex items-center gap-4 pt-2">
				{userInfo?.id === author.id && (
					<>
						<span
							className="w-5 active:opacity-70 cursor-pointer fill-theme-dark"
							onClick={() => onDelete && onDelete({ id, parentId: parentId ? parentId : undefined })}
						>
							<DeleteIcon />
						</span>

						<span
							className="w-5 active:opacity-70 cursor-pointer fill-theme-dark"
							onClick={() => {
								onEdit && onEdit({ id, description, parentId: parentId ? parentId : undefined });
								focusId && onFocus({ focusId });
							}}
						>
							<EditIcon />
						</span>
					</>
				)}

				<span
					className="active:opacity-70 cursor-pointer fill-theme-dark flex items-center gap-2"
					onClick={() => {
						!parentId && !children && onGetReplies && onGetReplies({ id });
						onReply && onReply({ id, parentId: parentId || undefined, authorName: author.username });
						focusId && onFocus({ focusId });
					}}
				>
					<ReplyIcon className="w-5" />

					{_count && _count.children > 0 && (
						<>
							<span> replies : </span>
							<span>{_count.children}</span>
						</>
					)}
				</span>

				<span className="flex-1"></span>
				<span>{<DateFormatter date={updatedAt} />}</span>
			</p>
		</div>
	);
}
