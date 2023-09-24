import React, { FormEvent, useState } from "react";
import Modal from "../Modal";
import CardModal from "@components/cards/modal-card";
import FormRichText from "@components/forms/form-rich-text";
import FormSection from "@components/forms/form-section";
import ButtonBase, { BaseButtonVariety } from "@components/common/base-button";
import Form from "@components/forms/form";
import { useAdminOneTicket } from "@hooks/admin/useAdminOneTicket";

export default function ModalAdminTicketAnswer({ onCloseModal, ticketId, title }: { ticketId: number; title: string; onCloseModal: () => void }) {
	const [description, setDescription] = useState<string>("");

	const { addAnswer } = useAdminOneTicket();

	async function onSubmit(event: FormEvent) {
		event.preventDefault();
		const res = await addAnswer({ description, ticketId });
		if (res) onCloseModal();
	}

	return (
		<Modal onCloseModal={onCloseModal}>
			<CardModal>
				<Form onSubmit={onSubmit}>
					<FormSection title={`answer to ticket : ${title} `}>
						<FormRichText value={description} onChange={setDescription} />
					</FormSection>
					<ButtonBase Variety={BaseButtonVariety.primary}>send message</ButtonBase>
				</Form>
			</CardModal>
		</Modal>
	);
}
