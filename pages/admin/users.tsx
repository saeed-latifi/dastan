import AdminUserCard from "@components/cards/admin-user-card";
import LoadingSpinner from "@components/icons/LoadingSpinner";
import FormSection from "@components/forms/form-section";
import Navigation from "@components/navigation";
import { useAdminUsers } from "@hooks/admin/useAdminUsers";
import { useAccount } from "@hooks/useAccount";
import React from "react";
import InfiniteScroll from "react-infinite-scroller";
import { staticURLs } from "statics/url";

export default function AdminUsers() {
	const { checkAccessAndRedirect } = useAccount();
	const { hasMore, isLoading, users, setPage, isValidating } = useAdminUsers();
	checkAccessAndRedirect("ADMIN");

	// if (isLoading) return <LoadingSpinner />;
	return (
		<div className="flex flex-col w-full p-4 gap-4 max-w-theme">
			<Navigation label="admin" path={staticURLs.client.admin.base} />

			<FormSection title="users">
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
						{users?.map((page) => page?.users.map((user) => <AdminUserCard user={user} key={user.id} />))}
					</div>
				</InfiniteScroll>
				{isValidating && <LoadingSpinner />}
			</FormSection>
		</div>
	);
}
