import NotFoundIcon from "@components/icons/not-found-icon";
import React from "react";

export default function NotFound({ title }: { title: string }) {
	return (
		<div className="flex flex-col gap-4 items-center justify-center">
			<NotFoundIcon width="4rem" height="4rem" />
			<p className="flex items-center gap-4">
				<span>not found this :</span> <span>{title}</span>
			</p>
		</div>
	);
}
