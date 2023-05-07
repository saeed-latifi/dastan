import ButtonBase from "@components/common/base-button";
import { useAccount } from "@hooks/useAccount";
import { useTeam } from "@hooks/useTeam";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export default function Team() {
	const router = useRouter();
	const { checkAccessRedirect } = useAccount();
	checkAccessRedirect();

	const { teamsInfo } = useTeam();

	return (
		<div className="flex flex-col gap-2 w-full max-w-md">
			<ButtonBase type="button" onClick={() => router.push("/team/modify")}>
				add new Team
			</ButtonBase>
			{teamsInfo?.map((team, index) => (
				<Link key={index} href={"/team/modify?item=" + team.id}>
					{"update  "}
					{team.title}
				</Link>
			))}
		</div>
	);
}
