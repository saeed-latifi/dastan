/* eslint-disable react-hooks/exhaustive-deps */
import ButtonBase, { BaseButtonVariety } from "@components/common/base-button";
import CloseIcon from "@components/icons/close-icon";
import { zodResolver } from "@hookform/resolvers/zod";
import { useComment } from "@hooks/useComment";
import { iCommentCreateForm, zCommentCreateForm } from "@models/iComment";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { commentEditType, commentReplyType } from "./commentCard";

type propType = { contentId?: number; editInfo?: commentEditType; replyInfo?: commentReplyType; focusId?: string };
export default function AddComment({ contentId, editInfo, replyInfo, focusId }: propType) {
	const { addComment, updateComment } = useComment({ contentId });

	const wrapperRef = useRef(null);

	const [edit, setEdit] = useState<commentEditType>();
	const [reply, setReply] = useState<commentReplyType>();
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [wrapperRef]);

	function handleClickOutside(event: any) {
		const currentNode: any = wrapperRef.current;
		if (currentNode !== undefined) {
			if (!currentNode.contains(event.target)) {
				setIsOpen(false);
				clearErrors();
				setValue("description", "");
			}
		}
	}

	const {
		register,
		handleSubmit,
		formState: { errors },
		clearErrors,
		setValue,
	} = useForm<iCommentCreateForm>({ resolver: zodResolver(zCommentCreateForm) });

	useEffect(() => {
		if (editInfo) {
			setReply(undefined);
			setValue("description", editInfo?.description);
			setEdit(editInfo);
		}
	}, [editInfo]);

	useEffect(() => {
		if (replyInfo) {
			setEdit(undefined);
			setReply(replyInfo);
		}
	}, [replyInfo]);

	function onClear() {
		setEdit(undefined);
		setReply(undefined);
		setValue("description", "");
	}

	function onSubmit(body: iCommentCreateForm) {
		if (!contentId) return;

		const parentId = reply ? (reply?.parentId ? reply.parentId : reply.id) : undefined;
		const replyId = reply?.id;

		if (edit) {
			updateComment({ description: body.description, id: edit.id }, edit.parentId);
		} else {
			addComment({ description: body.description, contentId, parentId, replyId });
		}
		onClear();
	}

	return (
		<form
			ref={wrapperRef}
			onSubmit={handleSubmit(onSubmit)}
			className=" border border-theme-border rounded-theme-border p-2 flex flex-col gap-2 bg-white"
		>
			{reply && (
				<div className="flex items-center justify-between">
					<CloseIcon className="w-6" onClick={onClear} />
					<span className="flex items-center gap-2 text-sm">
						<span>answer to :</span>
						<span>{reply.authorName}</span>
					</span>
				</div>
			)}
			{edit && (
				<div className="flex items-center justify-between">
					<CloseIcon className="w-6" onClick={onClear} />
				</div>
			)}

			<textarea
				id={focusId}
				placeholder="add new comment"
				className="resize-none overflow-auto leading-7"
				{...register("description")}
				rows={3}
			/>
			<div className="w-full border-t border-theme-light-gray">
				{errors.description && <p className="text-theme-warn">{errors.description.message}</p>}
			</div>

			<ButtonBase Variety={BaseButtonVariety.form} type="submit">
				{editInfo ? "update" : "add comment"}
			</ButtonBase>
		</form>
	);
}
