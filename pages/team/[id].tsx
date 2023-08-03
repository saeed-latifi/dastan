import ContextCard from "@components/cards/context-card";
import LoadingSpinner from "@components/animations/LoadingAnimation";
import DateFormatter from "@components/dateFormatter";
import FormSection from "@components/forms/form-section";
import TeamLogo, { logoImageTypes } from "@components/images/team-logo";
import { useTeamFeed } from "@hooks/feed/useTeamFeed";
import { teamFeedJobType } from "@providers/prismaProviders/teamPrisma";
import Link from "next/link";
import { staticURLs } from "statics/url";

export default function TeamFeed() {
	const { teamInfo, isLoading, isValidating } = useTeamFeed();

	if (isLoading || isValidating) return <LoadingSpinner />;
	if (!teamInfo) return <div>not team with this id</div>;

	const { title, image, jobs, description, context, contactMethods, id } = teamInfo;

	return (
		<div className="flex flex-col gap-4 max-w-form w-full items-center py-4">
			{image && <TeamLogo logoType={logoImageTypes.full} image={image} />}
			<FormSection title="team info">
				<p>{title}</p>
				<p>{description}</p>
			</FormSection>
			{context && <ContextCard context={context} />}
			<FormSection title="content methods">
				{contactMethods.map((method, index) => (
					<p key={index}> {method}</p>
				))}
			</FormSection>
			<FormSection title="open jobs">
				{jobs.map((job) => (
					<JobCard job={job} key={job.id} />
				))}
			</FormSection>
		</div>
	);
}

function JobCard({ job }: { job: teamFeedJobType }) {
	return (
		<div className="border border-theme-border rounded-theme-border p-3 flex flex-col gap-4 text-theme-shade">
			<Link href={staticURLs.client.feed.jobs.one(job.id)} className="text-xl">
				{job.title}
			</Link>
			<div className="flex items-center justify-between">
				<p>{job.category.title}</p>
				<DateFormatter date={job.createdAt} />
			</div>
		</div>
	);
}
