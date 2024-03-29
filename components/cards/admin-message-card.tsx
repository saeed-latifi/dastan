import ModalAdminViewMessage from "@components/modals/admin/modal-admin-update-message";
import { ModalContext } from "@providers/contexts/ModalContext";
import { AdminMessageResType } from "@providers/prismaProviders/adminMessagePrisma";
import React, { useContext } from "react";

export default function AdminMessageCard({ message }: { message: AdminMessageResType }) {
	const { onCloseModal, setModal } = useContext(ModalContext);

	function onOpenMessageModal() {
		setModal(<ModalAdminViewMessage onCloseModal={onCloseModal} message={message} />);
	}

	return (
		<div className="flex items-center justify-between border  border-theme-border rounded-theme-border p-2">
			<p className="cursor-pointer select-none hover:text-theme-border active:opacity-80" onClick={onOpenMessageModal}>
				{message.title}
			</p>
			<p className="select-none">{message.user.username}</p>
		</div>
	);
}
