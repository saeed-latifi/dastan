import UserMessageCard from "@components/cards/user-message-card";
import LoadingSpinner from "@components/icons/LoadingSpinner";
import Navigation from "@components/navigation";
import { usePanelAdminMessages } from "@hooks/panel/usePanelAdminMessage";
import React from "react";
import InfiniteScroll from "react-infinite-scroller";
import { staticURLs } from "statics/url";

export default function UserAdminMessages() {
	const { isLoading, messages, hasMore, setPage } = usePanelAdminMessages();

	if (isLoading) return <LoadingSpinner />;
	return (
		<div className="flex flex-col w-full p-2 max-w-theme gap-2">
			<Navigation label="panel" path={staticURLs.client.account.base} />

			<InfiniteScroll
				pageStart={0}
				loadMore={setPage}
				hasMore={hasMore}
				loader={<LoadingSpinner key={"loader"} />}
				useWindow={true}
				initialLoad={true}
				threshold={150}
			>
				<div key="userAdminMessageList" className="flex flex-col w-full gap-2 max-w-theme">
					{messages?.map((page) => page?.messages.map((message) => <UserMessageCard message={message} key={message.id} />))}
				</div>
			</InfiniteScroll>
		</div>
	);
}
