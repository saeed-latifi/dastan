import DateFormatter from "@components/dateFormatter";
import DeleteIcon from "@components/icons/delete-icon";
import EditIcon from "@components/icons/edit-icon";
import ReplyIcon from "@components/icons/reply-icon";
import { commentResType } from "@providers/prismaProviders/commentPrisma";
import React from "react";

type onEditType = ({ id, description }: { id: number; description: string }) => void;
type onReplyType = ({ id, parentId }: { id: number; parentId: number | null }) => void;
type onDeleteType = ({ id }: { id: number }) => any;

type propsType = { comment: commentResType; onEdit?: onEditType; onReply?: onReplyType; onDelete?: onDeleteType };

export default function CommentCard({ comment, onEdit, onReply, onDelete }: propsType) {
	const { author, contentId, createdAt, description, id, parentId, replyId, updatedAt } = comment;

	return (
		<div key={comment.id} className=" border-b border-theme-light-gray py-2 px-1 last:border-b-0 flex flex-col gap-1">
			<p>{author.username}</p>
			<p>{description}</p>
			<p className="flex items-center gap-4 pt-2">
				<span className="w-5 active:opacity-70 cursor-pointer fill-theme-dark" onClick={() => onDelete && onDelete({ id })}>
					<DeleteIcon />
				</span>

				<span
					className="w-5 active:opacity-70 cursor-pointer fill-theme-dark"
					onClick={() => onEdit && onEdit({ id, description })}
				>
					<EditIcon />
				</span>

				<span
					className="w-5 active:opacity-70 cursor-pointer fill-theme-dark"
					onClick={() => onReply && onReply({ id, parentId })}
				>
					<ReplyIcon />
				</span>

				<span className="flex-1"></span>
				<span>{<DateFormatter date={updatedAt} />}</span>
			</p>
		</div>
	);
}
