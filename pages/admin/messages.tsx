import AdminMessageCard from "@components/cards/admin-message-card";
import LoadingSpinner from "@components/animations/LoadingAnimation";
import FormSection from "@components/forms/form-section";
import Navigation from "@components/navigation";
import { useAdminMessages } from "@hooks/admin/useAdminMessages";
import { useAccount } from "@hooks/useAccount";
import React from "react";
import InfiniteScroll from "react-infinite-scroller";
import { staticURLs } from "statics/url";

export default function AdminMessages() {
	const { checkAccessAndRedirect } = useAccount();

	const { hasMore, setPage, messages } = useAdminMessages();
	checkAccessAndRedirect("ADMIN");

	return (
		<div className="flex flex-col w-full p-4 gap-4 max-w-theme">
			<Navigation label="admin" path={staticURLs.client.admin.base} />
			<FormSection title="messages">
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
						{messages?.map((page) => page?.messages.map((message) => <AdminMessageCard message={message} key={message.id} />))}
					</div>
				</InfiniteScroll>
			</FormSection>
		</div>
	);
}
