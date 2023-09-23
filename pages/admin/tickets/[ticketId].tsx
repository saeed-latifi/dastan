import FormSection from "@components/forms/form-section";
import LoadingSpinner from "@components/icons/LoadingSpinner";
import Navigation from "@components/navigation";
import { useAdminOneTicket } from "@hooks/admin/useAdminOneTicket";
import { staticURLs } from "statics/url";

export default function AdminOneTicket() {
	const { isLoading, isValidating, ticket } = useAdminOneTicket();
	if (isLoading) return <LoadingSpinner />;
	if (!ticket) {
		return (
			<div>
				<p>{"this thicket id don't exist"}</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col w-full p-4 gap-4 max-w-theme">
			<Navigation label="tickets" path={staticURLs.client.admin.tickets.base} />
			<FormSection title={ticket.title} />
			<p>from : {ticket.user.username}</p>
			{ticket.messages.map((message) => (
				<p key={message.id}>{message.description}</p>
			))}
		</div>
	);
}
