import DateFormatter from "@components/dateFormatter";
import { jobFeedType } from "@providers/prismaProviders/jobPrisma";
import React from "react";

export default function JobFeedCard({ job }: { job: jobFeedType }) {
	const { title, id, category, wageType, wage, updatedAt, province, description, team } = job;
	return (
		<div className="flex flex-col gap-2 border border-theme-border rounded-theme-border p-2 w-full ">
			<p>{title}</p>
			<div>{category.title}</div>
			<div>{team.title}</div>
			<div>{wageType}</div>
			<div>
				<DateFormatter date={updatedAt} />
			</div>
		</div>
	);
}
