import ButtonBase from "@components/common/base-button";
import LoaderSpinner from "@components/common/loader-spinner";
import FormSection from "@components/forms/form-section";
import { useAccount } from "@hooks/useAccount";
import { useTeam } from "@hooks/useTeam";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export default function Team() {
	const router = useRouter();
	const { checkAccessRedirect } = useAccount();
	checkAccessRedirect();

	const { teamsInfo, isLoading, allowMoreTeam } = useTeam();

	if (isLoading) return <LoaderSpinner />;

	return (
		<div className="flex flex-col gap-4 w-full max-w-md">
			{allowMoreTeam() && (
				<ButtonBase type="button" onClick={() => router.push("/team/modify")}>
					add new Team
				</ButtonBase>
			)}

			{teamsInfo && teamsInfo.length > 0 && (
				<FormSection title="your Teams">
					{teamsInfo.map((team, index) => (
						<Link key={index} href={"/team/modify?item=" + team.id}>
							{team.title}
						</Link>
					))}
				</FormSection>
			)}
		</div>
	);
}
