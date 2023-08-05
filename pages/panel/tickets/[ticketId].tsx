import ButtonBase from "@components/common/base-button";
import NotFound from "@components/common/not-found";
import Form from "@components/forms/form";
import FormSection from "@components/forms/form-section";
import TextArea from "@components/forms/form-text-area";
import LoadingSpinner from "@components/icons/LoadingSpinner";
import Navigation from "@components/navigation";
import { usePanelTicketOne } from "@hooks/panel/usePanelTicketOne";
import React, { FormEvent, useState } from "react";
import { staticURLs } from "statics/url";

export default function TicketId() {
	const { ticketInfo, isLoading, isValidating, addMessage } = usePanelTicketOne();
	const [description, setDescription] = useState("");

	async function onAddMessage(event: FormEvent) {
		event.preventDefault();
		await addMessage(description);
		setDescription("");
	}

	if (isLoading) return <LoadingSpinner />;
	if (!ticketInfo) return <NotFound title="ticket" />;

	return (
		<div className=" flex flex-col items-center w-full">
			<div className=" flex flex-col items-center gap-4 w-full max-w-theme">
				<Navigation label="tickets" path={staticURLs.client.panel.tickets.base} />
				<Form onSubmit={onAddMessage}>
					<FormSection title={ticketInfo?.title}>
						<TextArea value={description} onChange={(event) => setDescription(event.target.value)} />
						<ButtonBase>add message</ButtonBase>
						{ticketInfo.messages.map((message) => (
							<div
								key={message.id}
								className={`flex flex-col gap-4  p-4 rounded-theme-border
                                            ${message.isAdmin ? "bg-theme-light-gray" : "bg-theme-border-light"}`}
							>
								{message.isAdmin ? <span>admin : </span> : <span>you : </span>}
								<p> {message.description}</p>
							</div>
						))}
					</FormSection>
				</Form>
			</div>
		</div>
	);
}
