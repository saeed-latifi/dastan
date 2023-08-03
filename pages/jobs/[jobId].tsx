import LoadingSpinner from "@components/animations/LoadingAnimation";
import DateFormatter from "@components/dateFormatter";
import FormSection from "@components/forms/form-section";
import TeamLogo, { logoImageTypes } from "@components/images/team-logo";
import { useOneJobFeed } from "@hooks/feed/useOneJobFeed";
import { useRouter } from "next/router";
import { staticURLs } from "statics/url";

export default function JobView() {
	const router = useRouter();
	const { jobInfo, isLoading } = useOneJobFeed();

	const onTeam = () => router.push(staticURLs.client.feed.team(team.id));

	if (isLoading) return <LoadingSpinner />;
	if (!jobInfo)
		return (
			<div>
				<p>no exist job for this id</p>
			</div>
		);

	const { benefits, category, description, id, province, requirements, team, title, updatedAt, wage, wageType } = jobInfo;
	return (
		<div className="flex flex-col p-3 gap-6 w-full max-w-theme text-theme-text ">
			<FormSection title="info">
				<p>{title}</p>
				<p>{description}</p>
				<p>{category.title}</p>
				<p>{province ? province.title : "remote"}</p>
			</FormSection>
			{requirements.length > 0 && (
				<FormSection title="requirements">
					{requirements.map((req, index) => (
						<p className="p-2 border-b border-theme-border-light" key={index}>
							{req}
						</p>
					))}
				</FormSection>
			)}
			{benefits.length > 0 && (
				<FormSection title="benefits">
					{benefits.map((req, index) => (
						<p className="p-2 border-b border-theme-border-light" key={index}>
							{req}
						</p>
					))}
				</FormSection>
			)}

			<FormSection title="payment">
				<div className="flex items-center justify-between">
					<p>{wageType}</p>
					{wageType === "FIXED" && <p>{wage}</p>}
				</div>
			</FormSection>

			<FormSection title="team info">
				<div className="flex gap-2">
					<span className="w-6 aspect-square flex items-center cursor-pointer" onClick={onTeam}>
						<TeamLogo logoType={logoImageTypes.thumb} image={team.image} />
					</span>
					<span className="cursor-pointer" onClick={onTeam}>
						{team.title}
					</span>
					<span className="flex-1"></span>
					<DateFormatter date={updatedAt} />
				</div>
			</FormSection>
		</div>
	);
}
