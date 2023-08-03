import DateFormatter from "@components/dateFormatter";
import DeleteIcon from "@components/icons/delete-icon";
import ModalUserDeleteMessage from "@components/modals/messages/modal-user-delete-message";
import ModalUserReadMessage from "@components/modals/messages/modal-user-read-message";
import { ModalContext } from "@providers/contexts/ModalContext";
import { AdminMessageResType } from "@providers/prismaProviders/adminMessagePrisma";
import React, { useContext } from "react";

export default function UserMessageCard({ message }: { message: AdminMessageResType }) {
	const { onCloseModal, setModal } = useContext(ModalContext);

	function onOpenMessageModal() {
		setModal(<ModalUserReadMessage onCloseModal={onCloseModal} message={message} />);
	}
	function onOpenDeleteModal() {
		setModal(<ModalUserDeleteMessage onCloseModal={onCloseModal} message={message} />);
	}

	return (
		<div className="flex flex-col items-center justify-between border  border-theme-border rounded-theme-border p-2 gap-4">
			<div className="w-full flex items-center justify-between">
				<p className="cursor-pointer select-none hover:text-theme-border active:opacity-80" onClick={onOpenMessageModal}>
					{message.title}
				</p>
				<span className={`w-3 h-3 rounded-full mr-1 ${message.isRead ? "bg-theme-border" : "bg-theme-warn"}`}></span>
			</div>
			<div className="w-full flex items-center justify-between">
				<DateFormatter date={message.createdAt} />
				<DeleteIcon className="w-5 h-5 hover:opacity-80 active:opacity-60 cursor-pointer" onClick={onOpenDeleteModal} />
			</div>
		</div>
	);
}
