import React, { FormEvent, useState } from "react";
import Modal from "../Modal";
import CardModal from "@components/cards/modal-card";
import FormRichText from "@components/forms/form-rich-text";
import FormSection from "@components/forms/form-section";
import ButtonBase, { BaseButtonVariety } from "@components/common/base-button";
import Form from "@components/forms/form";
import { useAdminOneTicket } from "@hooks/admin/useAdminOneTicket";

export default function ModalAdminTicketUpdateAnswer({
	onCloseModal,
	messageId,
	description: preDescription,
}: {
	messageId: number;
	description: string;
	onCloseModal: () => void;
}) {
	const [description, setDescription] = useState<string>(preDescription);

	const { updateAnswer } = useAdminOneTicket();

	async function onSubmit(event: FormEvent) {
		event.preventDefault();
		const res = await updateAnswer({ description, messageId });
		if (res) onCloseModal();
	}

	return (
		<Modal onCloseModal={onCloseModal}>
			<CardModal>
				<Form onSubmit={onSubmit}>
					<FormSection title={`update the answer `}>
						<FormRichText value={description} onChange={setDescription} />
					</FormSection>
					<ButtonBase Variety={BaseButtonVariety.primary}>update message</ButtonBase>
				</Form>
			</CardModal>
		</Modal>
	);
}
