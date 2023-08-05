import { usePanelTickets } from "@hooks/panel/usePanelTickets";
import { ModalContext } from "@providers/contexts/ModalContext";
import { ticketResType } from "@providers/prismaProviders/ticketPrisma";
import Link from "next/link";
import { useContext } from "react";
import { staticURLs } from "statics/url";
import CardModal from "./modal-card";
import ButtonBase from "@components/common/base-button";
import DeleteIcon from "@components/icons/delete-icon";
import Modal from "@components/modals/Modal";

export default function TicketPanelCard({ ticket }: { ticket: ticketResType }) {
	const { closeTicket } = usePanelTickets();

	const { setModal, onCloseModal } = useContext(ModalContext);

	function onCloseTicket() {
		setModal(
			<Modal onCloseModal={onCloseModal}>
				<CardModal>
					<div className="flex flex-col gap-4 p-4">
						<p>are you sure close this ticket?</p>
						<div className="flex gap-4">
							<ButtonBase
								onClick={async () => {
									const data = await closeTicket(ticket.id);
									if (data) onCloseModal();
								}}
							>
								yes
							</ButtonBase>
							<ButtonBase onClick={onCloseModal}>no</ButtonBase>
						</div>
					</div>
				</CardModal>
			</Modal>
		);
	}

	return (
		<div className="border border-theme-border rounded-theme-border p-2 flex flex-col gap-2 text-theme-text">
			<div className=" flex items-center justify-between">
				<Link
					href={staticURLs.client.panel.tickets.on({ id: ticket.id })}
					className="truncate cursor-pointer text-theme-dark select-none hover:opacity-80 active:opacity-60"
				>
					{ticket.title}
				</Link>
				<DeleteIcon onClick={onCloseTicket} className="w-5 h-5 fill-theme-select hover:opacity-80 active:opacity-60 cursor-pointer" />
			</div>
			<p className="truncate"> {ticket.messages[0].description}</p>
		</div>
	);
}
