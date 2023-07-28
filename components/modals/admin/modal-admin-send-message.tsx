import React, { FormEvent, useState } from "react";
import Modal from "../Modal";
import CardModal from "@components/cards/modal-card";
import FormRichText from "@components/forms/form-rich-text";
import FormSection from "@components/forms/form-section";
import { userAdminResType } from "@providers/prismaProviders/userPrisma";
import ButtonBase, { BaseButtonVariety } from "@components/common/base-button";
import Form from "@components/forms/form";
import { useAdminMessages } from "@hooks/admin/useAdminMessages";
import FormInput from "@components/forms/form-input";

export default function ModalAdminSendMessage({ onCloseModal, user }: { user: userAdminResType; onCloseModal: () => void }) {
	const [description, setDescription] = useState<string>("");
	const [title, setTitle] = useState<string>("");

	const { sendMessage } = useAdminMessages();

	function onSubmit(event: FormEvent) {
		event.preventDefault();
		sendMessage({ description, title, userId: user.id });
	}

	return (
		<Modal onCloseModal={onCloseModal}>
			<CardModal>
				<Form onSubmit={onSubmit}>
					<FormSection title={`send message to ${user.username} `}>
						<FormInput value={title} onChange={(event) => setTitle(event.target.value)} />
						<FormRichText value={description} onChange={setDescription} />
					</FormSection>
					<ButtonBase Variety={BaseButtonVariety.primary}>send message</ButtonBase>
				</Form>
			</CardModal>
		</Modal>
	);
}
