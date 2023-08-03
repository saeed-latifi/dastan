import LoadingSpinner from "@components/animations/LoadingAnimation";
import { usePanelAdminMessages } from "@hooks/panel/usePanelAdminMessage";
import React from "react";
import InfiniteScroll from "react-infinite-scroller";

export default function AdminMessages() {
	const { isLoading, messages, hasMore, setPage } = usePanelAdminMessages();

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
					{messages?.map((page) => page?.messages.map((message) => <div key={message.id}>{message.title}</div>))}
				</div>
			</InfiniteScroll>
		</div>
	);
}
