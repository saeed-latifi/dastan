import ModalAdminTicketUpdateAnswer from "@components/modals/admin/modal-admin-ticket-update-answer";
import { ModalContext } from "@providers/contexts/ModalContext";
import { ticketMessageType } from "@providers/prismaProviders/ticketPrisma";
import { useContext } from "react";

export default function AdminTicketMessageCard({ message }: { message: ticketMessageType }) {
	const { onCloseModal, setModal } = useContext(ModalContext);

	function onOpenAnswerModal({ messageId, description }: { description: string; messageId: number }) {
		setModal(<ModalAdminTicketUpdateAnswer onCloseModal={onCloseModal} description={description} messageId={messageId} />);
	}

	return (
		<div
			className={`flex items-end justify-between border border-theme-border rounded-theme-border text-theme-shade ${
				message.isAdmin ? "bg-sky-100" : "bg-lime-100"
			}`}
		>
			<div className="ql-editor w-full" dangerouslySetInnerHTML={{ __html: message.description }} />

			{message.isAdmin && (
				<p
					className="cursor-pointer select-none active:opacity-70 text-sm p-4 pl-0"
					onClick={() => onOpenAnswerModal({ messageId: message.id, description: message.description })}
				>
					edit
				</p>
			)}
		</div>
	);
}
