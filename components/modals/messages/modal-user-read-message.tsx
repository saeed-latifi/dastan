/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import Modal from "../Modal";
import CardModal from "@components/cards/modal-card";
import { AdminMessageResType } from "@providers/prismaProviders/adminMessagePrisma";
import CloseIcon from "@components/icons/close-icon";
import { usePanelAdminMessages } from "@hooks/panel/usePanelAdminMessage";

export default function ModalUserReadMessage({ onCloseModal, message }: { message: AdminMessageResType; onCloseModal: () => void }) {
	const { onView } = usePanelAdminMessages();

	async function handleOnView() {
		if (!message.isRead) onView({ messageId: message.id });
	}

	useEffect(() => {
		handleOnView();
	}, []);

	return (
		<Modal onCloseModal={onCloseModal}>
			<CardModal>
				<div className="flex flex-col max-w-form w-full ">
					<div className="w-full flex items-center justify-between gap-2 px-2 pb-2 border-b border-x-gray-500 font-semibold text-theme-dark">
						<p>{message.title}</p>
						<CloseIcon
							onClick={onCloseModal}
							className="cursor-pointer fill-theme-dark-gray w-5 h-5 hover:fill-theme-dark active:opacity-80 "
						/>
					</div>
					<div className="ql-editor " dangerouslySetInnerHTML={{ __html: message.description }}></div>
				</div>
			</CardModal>
		</Modal>
	);
}
