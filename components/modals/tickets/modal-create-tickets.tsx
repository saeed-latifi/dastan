import FormInput from "@components/forms/form-input";
import TextArea from "@components/forms/form-text-area";
import React, { FormEvent, useState } from "react";
import Modal from "../Modal";
import CardModal from "@components/cards/modal-card";
import Form from "@components/forms/form";
import FormSection from "@components/forms/form-section";
import ButtonBase from "@components/common/base-button";
import { usePanelTickets } from "@hooks/panel/usePanelTickets";

export default function ModalCreateTickets({ onCloseModal }: { onCloseModal: () => void }) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	const { createTicket } = usePanelTickets();

	async function onSubmit(event: FormEvent) {
		event.preventDefault();
		const res = await createTicket({ title, description });
		if (res) onCloseModal();
	}

	return (
		<Modal onCloseModal={onCloseModal}>
			<CardModal>
				<Form onSubmit={onSubmit}>
					<FormSection title="open a ticket">
						<FormInput value={title} onChange={(event) => setTitle(event.target.value)} />
						<TextArea value={description} onChange={(event) => setDescription(event.target.value)} />
					</FormSection>
					<ButtonBase>send </ButtonBase>
				</Form>
			</CardModal>
		</Modal>
	);
}
