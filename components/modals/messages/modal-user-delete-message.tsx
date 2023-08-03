import Modal from "../Modal";
import CardModal from "@components/cards/modal-card";
import { AdminMessageResType } from "@providers/prismaProviders/adminMessagePrisma";
import { usePanelAdminMessages } from "@hooks/panel/usePanelAdminMessage";
import ButtonBase from "@components/common/base-button";

export default function ModalUserDeleteMessage({ onCloseModal, message }: { message: AdminMessageResType; onCloseModal: () => void }) {
	const { onDelete } = usePanelAdminMessages();

	async function handleOnDelete() {
		const data = await onDelete({ messageId: message.id });
		if (data) onCloseModal();
	}

	return (
		<Modal onCloseModal={onCloseModal}>
			<CardModal>
				<div className="flex flex-col max-w-form w-full gap-4 p-4 ">
					<p>are you sure about delete this message!</p>
					<div className="flex items-center gap-4 justify-around">
						<ButtonBase onClick={handleOnDelete}>yes</ButtonBase>
						<ButtonBase onClick={onCloseModal}>no</ButtonBase>
					</div>
				</div>
			</CardModal>
		</Modal>
	);
}
