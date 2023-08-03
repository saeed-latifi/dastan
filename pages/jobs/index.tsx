import JobFeedCard from "@components/cards/job-feed-card";
import LoadingSpinner from "@components/animations/LoadingAnimation";
import { useJobFeed } from "@hooks/feed/useJobFeed";
import InfiniteScroll from "react-infinite-scroller";

export default function JobsFeedPage() {
	const { isLoading, jobsInfo, setPage, hasMore } = useJobFeed({});

	if (isLoading) return <LoadingSpinner />;
	return (
		<div className="flex flex-col w-full p-2 max-w-theme">
			<InfiniteScroll
				pageStart={0}
				loadMore={setPage}
				hasMore={hasMore}
				loader={<LoadingSpinner key={"loader"} />}
				useWindow={true}
				initialLoad={true}
				threshold={150}
			>
				<div key="jobList" className="flex flex-col w-full gap-2 max-w-theme">
					{jobsInfo?.map((page) => page?.jobs.map((job) => <JobFeedCard key={job.id} job={job} />))}
				</div>
			</InfiniteScroll>
		</div>
	);
}
