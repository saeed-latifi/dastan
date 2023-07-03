import LoadingSpinner from "@components/common/loader-spinner";
import { useJobFeed } from "@hooks/feed/useJobFeed";

export default function JobsFeedPage() {
	const { isLoading, jobsInfo } = useJobFeed({});

	if (isLoading) return <LoadingSpinner />;

	return (
		<div className="flex flex-col">
			{jobsInfo?.map((job) => (
				<div key={job.id}>{job.title}</div>
			))}
		</div>
	);
}
