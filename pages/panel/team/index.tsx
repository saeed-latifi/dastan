import ButtonBase from "@components/common/base-button";
import LoadingSpinner from "@components/animations/LoadingAnimation";
import FormSection from "@components/forms/form-section";
import TeamLogo from "@components/images/team-logo";
import { useAccount } from "@hooks/useAccount";
import { useTeamPanel } from "@hooks/panel/useTeamPanel";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { staticURLs } from "statics/url";

export default function Team() {
	const router = useRouter();
	const { checkAccessAndRedirect } = useAccount();
	checkAccessAndRedirect();

	const { teamsInfo, isLoading, allowMoreTeam } = useTeamPanel();

	if (isLoading) return <LoadingSpinner />;

	return (
		<div className="flex flex-col gap-4 w-full max-w-md py-4">
			{allowMoreTeam() && (
				<ButtonBase type="button" onClick={() => router.push(staticURLs.client.panel.team.add)}>
					add new Team
				</ButtonBase>
			)}

			{teamsInfo && teamsInfo.length > 0 && (
				<FormSection title="your Teams">
					{teamsInfo.map((team, index) => (
						<div key={index} className="flex items-center justify-between gap-2">
							<Link href={staticURLs.client.panel.team.one({ teamId: team.id })}>{team.title}</Link>
							<TeamLogo image={team.image} />
						</div>
					))}
				</FormSection>
			)}
		</div>
	);
}
