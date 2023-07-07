import { teamFeedResType } from "@providers/prismaProviders/teamPrisma";

export default function TeamCard({ teamInfo }: { teamInfo: teamFeedResType }) {
	const { title } = teamInfo;
	return (
		<div>
			<p>{title}</p>
		</div>
	);
}
