import DateFormatter from "@components/dateFormatter";
import TeamLogo, { logoImageTypes } from "@components/images/team-logo";
import { jobFeedType } from "@providers/prismaProviders/jobPrisma";
import { useRouter } from "next/router";
import React from "react";
import { staticURLs } from "statics/url";

export default function JobFeedCard({ job }: { job: jobFeedType }) {
	const { title, category, wageType, updatedAt, team, province, description, id, wage } = job;
	const router = useRouter();
	const onTeam = () => router.push(staticURLs.client.feed.team(team.id));

	return (
		<div className="flex flex-col gap-2 border border-theme-border rounded-theme-border p-2 w-full ">
			<p>{title}</p>
			<p className="gap-2">
				<span>category : </span>
				<span>{category.title}</span>
			</p>
			<div>{wageType}</div>
			<div className="flex gap-2">
				<span className="w-6 aspect-square flex items-center cursor-pointer" onClick={onTeam}>
					<TeamLogo logoType={logoImageTypes.full} image={team.image} />
				</span>
				<span className="cursor-pointer" onClick={onTeam}>
					{team.title}
				</span>
				<span className="flex-1"></span>
				<DateFormatter date={updatedAt} />
			</div>
		</div>
	);
}
