import ModalAdminSendMessage from "@components/modals/admin/modal-admin-send-message";
import { ModalContext } from "@providers/contexts/ModalContext";
import { userAdminResType } from "@providers/prismaProviders/userPrisma";
import React, { useContext } from "react";

export default function AdminUserCard({ user }: { user: userAdminResType }) {
	const { modal, onCloseModal, setModal } = useContext(ModalContext);

	console.log(modal);
	function onOpenMessageModal() {
		setModal(<ModalAdminSendMessage onCloseModal={onCloseModal} user={user} />);
	}

	return (
		<div className="">
			<p onClick={onOpenMessageModal}>{user.username}</p>
		</div>
	);
}
