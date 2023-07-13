import ButtonBase from "@components/common/base-button";
import LoadingSpinner from "@components/common/loader-spinner";
import { useAccount } from "@hooks/useAccount";
import Link from "next/link";
import React from "react";
import { bucketUrl } from "statics/keys";
import { staticURLs } from "statics/url";

export default function ResumePanel() {
	const { checkAccessAndRedirect, isLoading, userInfo } = useAccount();
	checkAccessAndRedirect();

	if (isLoading) return <LoadingSpinner />;
	return (
		<div>
			<ButtonBase>
				<Link href={staticURLs.client.panel.resume.addImage}>add pic to you portfolio</Link>
			</ButtonBase>
			<div className="rounded-theme-border overflow-hidden w-full max-w-3xl grid grid-cols-2 border border-theme-border  bg-theme-light gap-2 p-2">
				{userInfo?.portfolio.map((pic, index) => (
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
