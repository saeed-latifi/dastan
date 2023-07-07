import TeamCard from "@components/cards/team-feed-card";
import LoadingSpinner from "@components/common/loader-spinner";
import { useTeamFeed } from "@hooks/feed/useTeamFeed";

export default function TeamFeed() {
	const { teamInfo, isLoading, isValidating } = useTeamFeed();

	if (isLoading || isValidating) return <LoadingSpinner />;
	if (!teamInfo) return <div>not team with this id</div>;
	return <TeamCard teamInfo={teamInfo} />;
}
