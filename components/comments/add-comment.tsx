/* eslint-disable react-hooks/exhaustive-deps */
import ButtonBase, { BaseButtonVariety } from "@components/common/base-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useComment } from "@hooks/useComment";
import { iCommentCreateForm, zCommentCreateForm } from "@models/iComment";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

export default function AddComment({ contentId, parentId, replyId }: { contentId?: number; parentId?: number; replyId?: number }) {
	const { addComment } = useComment({ contentId });

	const [isOpen, setIsOpen] = useState(false);
	const wrapperRef = useRef(null);

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [wrapperRef]);

	const {
		register,
		handleSubmit,
		formState: { errors },
		clearErrors,
		setValue,
	} = useForm<iCommentCreateForm>({ resolver: zodResolver(zCommentCreateForm) });

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

	function onSubmit(body: iCommentCreateForm) {
		if (!contentId) return;
		addComment({ description: body.description, parentId, replyId, contentId });
		setValue("description", "");
	}

	return (
		<form
			ref={wrapperRef}
			onSubmit={handleSubmit(onSubmit)}
			className=" border border-theme-border rounded-theme-border p-2 flex flex-col gap-2 bg-white"
			onClick={() => setIsOpen(true)}
		>
			<textarea
				placeholder="add new comment"
				className="resize-none overflow-auto leading-7"
				{...register("description")}
				rows={isOpen ? 3 : 1}
			/>
			<div className="w-full border-t border-theme-light-gray">
				{errors.description && <p className="text-theme-warn">{errors.description.message}</p>}
			</div>

			<ButtonBase Variety={BaseButtonVariety.form} type="submit">
				add comment
			</ButtonBase>
		</form>
	);
}
