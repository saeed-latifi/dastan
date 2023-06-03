import ButtonBase from "@components/common/base-button";
import LoaderSpinner from "@components/common/loader-spinner";
import { useResumeFeed } from "@hooks/feed/useResumeFeed";
import { useAccount } from "@hooks/useAccount";
import React, { useEffect, useState } from "react";

export default function Resume() {
	const { resumeInfo, isLoading, onFollow } = useResumeFeed();
	const { userInfo } = useAccount();
	const [freeze, setFreeze] = useState(false);

	if (isLoading) return <LoaderSpinner />;
	if (!resumeInfo) return <p>not valid!</p>;

	const followedByMe = resumeInfo.followers[0]?.id === userInfo.id;
	const isMyProfile = resumeInfo.id === userInfo.id;
	async function handleOnFollow() {
		if (freeze) return;
		setFreeze(true);
		await onFollow(followedByMe);
		setFreeze(false);
	}

	return (
		<div className="flex flex-col w-full items-center gap-2 p-2">
			<div
				className="flex flex-wrap items-center justify-between gap-2 w-full max-w-3xl
			pb-2 border-b border-theme-border"
			>
				<span className="flex items-center gap-2">
					<img
						className="aspect-square overflow-hidden border rounded-full border-theme-border object-cover w-10"
						src={resumeInfo.image ? resumeInfo.image : "/images/profile.svg"}
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

				{!isMyProfile && (
					<ButtonBase onClick={handleOnFollow}>
						{resumeInfo.followers[0]?.id === userInfo.id ? "unfollow" : "follow"}
					</ButtonBase>
				)}
			</div>
			{resumeInfo.resume?.context && (
				<div
					className="w-full rounded-theme-border p-2 border border-theme-border"
					dangerouslySetInnerHTML={{ __html: resumeInfo.resume?.context }}
				/>
			)}
			{resumeInfo.resume?.portfolio && (
				<div className="rounded-theme-border overflow-hidden w-full max-w-3xl grid grid-cols-2 border border-theme-border  bg-theme-light gap-2 p-2">
					{resumeInfo.resume?.portfolio.map((pic, index) => (
						<img
							key={index}
							className="w-full object-contain rounded-theme-border border border-theme-border"
							src={pic}
							alt="portfolio"
						/>
					))}
				</div>
			)}
		</div>
	);
}
