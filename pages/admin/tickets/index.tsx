import AdminTicketCard from "@components/cards/admin-ticket-card";
import FormSection from "@components/forms/form-section";
import LoadingSpinner from "@components/icons/LoadingSpinner";
import Navigation from "@components/navigation";
import { useAdminTickets } from "@hooks/admin/useAdminTickets";
import { useAccount } from "@hooks/useAccount";
import React from "react";
import InfiniteScroll from "react-infinite-scroller";
import { staticURLs } from "statics/url";

export default function Tickets() {
	const { checkAccessAndRedirect } = useAccount();
	checkAccessAndRedirect("ADMIN");

	const { hasMore, setPage, tickets } = useAdminTickets();
	return (
		<div className="flex flex-col w-full p-4 gap-4 max-w-theme">
			<Navigation label="admin" path={staticURLs.client.admin.base} />
			<FormSection title="tickets">
				<InfiniteScroll
					pageStart={0}
					loadMore={setPage}
					hasMore={hasMore}
					loader={<LoadingSpinner key={"loader"} />}
					useWindow={true}
					initialLoad={true}
					threshold={150}
				>
					<div key="adminTicketList" className="flex flex-col w-full gap-2 max-w-theme">
						{tickets?.map((page) => page?.items.map((ticket) => <AdminTicketCard ticket={ticket} key={ticket.id} />))}
					</div>
				</InfiniteScroll>
			</FormSection>
		</div>
	);
}
