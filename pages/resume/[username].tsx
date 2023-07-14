import ButtonBase from "@components/common/base-button";
import LoadingSpinner from "@components/common/loader-spinner";
import { useResumeFeed } from "@hooks/feed/useResumeFeed";
import { useAccount } from "@hooks/useAccount";
import React, { useState } from "react";
import { bucketUrl } from "statics/keys";

export default function Resume() {
	const { resumeInfo, isLoading, onFollow } = useResumeFeed();

	const { userInfo, checkAccessAndRedirect } = useAccount();
	checkAccessAndRedirect();
	const [freeze, setFreeze] = useState(false);

	if (isLoading) return <LoadingSpinner />;
	if (!resumeInfo) return <p>not valid!</p>;

	const followedByMe = userInfo ? resumeInfo.followers[0]?.id === userInfo.id : false;
	const isMyProfile = userInfo ? resumeInfo.id === userInfo.id : false;
	async function handleOnFollow() {
		if (freeze) return;
		setFreeze(true);
		await onFollow(followedByMe);
		setFreeze(false);
	}
	const src = resumeInfo.image ? `${bucketUrl}/profile/${resumeInfo.image}` : "/images/profile.svg";

	return (
		<div className="flex flex-col w-full items-center gap-2 p-2 max-w-3xl">
			<div className="flex flex-wrap items-center justify-between gap-2 w-full  pb-2 border-b border-theme-border">
				<span className="flex items-center gap-2">
					<img
						className="aspect-square overflow-hidden border rounded-full border-theme-border object-cover w-10"
						src={src}
						alt={resumeInfo.username}
					/>
					<span>{resumeInfo.username}</span>
				</span>
				<span className="flex items-center gap-2">
					<span>followers :</span>
					<span>{resumeInfo._count.followers}</span>
				</span>
				<span className="flex items-center gap-2">
					<span>follows : </span>
					<span>{resumeInfo._count.follows}</span>
				</span>

				{!isMyProfile && userInfo && (
					<ButtonBase onClick={handleOnFollow}>{resumeInfo.followers[0]?.id === userInfo.id ? "unfollow" : "follow"}</ButtonBase>
				)}
			</div>

			{resumeInfo.resumeContext ? (
				<div
					className="w-full ql-editor rounded-theme-border border border-theme-border h-max"
					dangerouslySetInnerHTML={{ __html: resumeInfo.resumeContext }}
				/>
			) : (
				""
			)}

			<div className="rounded-theme-border overflow-hidden w-full  grid grid-cols-2 border border-theme-border  bg-theme-light gap-2 p-2">
				{resumeInfo.portfolio.map((pic, index) => (
					<img
						key={index}
						className="w-full object-contain rounded-theme-border border border-theme-border"
						src={`${bucketUrl}/portfolio/${pic}`}
						alt="portfolio"
					/>
				))}
			</div>
		</div>
	);
}
