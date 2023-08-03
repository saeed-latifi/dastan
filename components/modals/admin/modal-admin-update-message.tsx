import React, { FormEvent, useState } from "react";
import Modal from "../Modal";
import CardModal from "@components/cards/modal-card";
import FormRichText from "@components/forms/form-rich-text";
import FormSection from "@components/forms/form-section";
import ButtonBase, { BaseButtonVariety } from "@components/common/base-button";
import Form from "@components/forms/form";
import { useAdminMessages } from "@hooks/admin/useAdminMessages";
import FormInput from "@components/forms/form-input";
import { AdminMessageResType } from "@providers/prismaProviders/adminMessagePrisma";

export default function ModalAdminViewMessage({ onCloseModal, message }: { message: AdminMessageResType; onCloseModal: () => void }) {
	const [description, setDescription] = useState<string>(message.description);
	const [title, setTitle] = useState<string>(message.title);

	const { updateMessage } = useAdminMessages();

	async function onSubmit(event: FormEvent) {
		event.preventDefault();
		const res = await updateMessage({ description, title, messageId: message.id });
		if (res) onCloseModal();
	}

	return (
		<Modal onCloseModal={onCloseModal}>
			<CardModal>
				<Form onSubmit={onSubmit}>
					<FormSection title={`send message to ${message.user.username} `}>
						<FormInput value={title} onChange={(event) => setTitle(event.target.value)} />
						<FormRichText value={description} onChange={setDescription} />
					</FormSection>
					<ButtonBase Variety={BaseButtonVariety.primary}>update message</ButtonBase>
				</Form>
			</CardModal>
		</Modal>
	);
}
