import ModalAdminSendMessage from "@components/modals/admin/modal-admin-send-message";
import { ModalContext } from "@providers/contexts/ModalContext";
import { userAdminResType } from "@providers/prismaProviders/userPrisma";
import React, { useContext } from "react";

export default function AdminUserCard({ user }: { user: userAdminResType }) {
	const { onCloseModal, setModal } = useContext(ModalContext);

	function onOpenMessageModal() {
		setModal(<ModalAdminSendMessage onCloseModal={onCloseModal} user={user} />);
	}

	return (
		<div className="">
			<p className="select-none cursor-pointer" onClick={onOpenMessageModal}>
				{user.username}
			</p>
		</div>
	);
}
