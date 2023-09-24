import AdminTicketMessageCard from "@components/cards/admin-ticket-message-card";
import ButtonBase, { BaseButtonVariety } from "@components/common/base-button";
import FormSection from "@components/forms/form-section";
import LoadingSpinner from "@components/icons/LoadingSpinner";
import ModalAdminTicketAnswer from "@components/modals/admin/modal-admin-ticket-answer";
import Navigation from "@components/navigation";
import { useAdminOneTicket } from "@hooks/admin/useAdminOneTicket";
import { ModalContext } from "@providers/contexts/ModalContext";
import { useContext } from "react";
import { staticURLs } from "statics/url";

export default function AdminOneTicket() {
	const { onCloseModal, setModal } = useContext(ModalContext);

	const { isLoading, isValidating, ticket } = useAdminOneTicket();
	if (isLoading) return <LoadingSpinner />;
	if (!ticket) {
		return (
			<div>
				<p>{"this thicket id don't exist"}</p>
			</div>
		);
	}

	function onOpenAnswerModal({ ticketId, title }: { title: string; ticketId: number }) {
		setModal(<ModalAdminTicketAnswer onCloseModal={onCloseModal} title={title} ticketId={ticketId} />);
	}

	return (
		<div className="flex flex-col w-full p-4 gap-4 max-w-theme">
			<Navigation label="tickets" path={staticURLs.client.admin.tickets.base} />
			<FormSection title={ticket.title} />
			<div className="flex items-center justify-between">
				<p>from : {ticket.user.username}</p>
				<ButtonBase
					className="px-2 min-w-[2rem]"
					Variety={BaseButtonVariety.form}
					onClick={() => onOpenAnswerModal({ ticketId: ticket.id, title: ticket.title })}
				>
					answer
				</ButtonBase>
			</div>
			{ticket.messages.map((message) => (
				<AdminTicketMessageCard key={message.id} message={message} />
			))}
		</div>
	);
}
