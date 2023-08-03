import ButtonBase from "@components/common/base-button";
import LoadingSpinner from "@components/animations/LoadingAnimation";
import Form from "@components/forms/form";
import FormRichText from "@components/forms/form-rich-text";
import FormSection from "@components/forms/form-section";
import DeleteIcon from "@components/icons/delete-icon";
import Modal from "@components/modals/Modal";
import { useAccount } from "@hooks/useAccount";
import { zResumeUpdate } from "@models/iResume";
import { sleep } from "@utilities/devSleep";
import Link from "next/link";
import React, { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { bucketUrl } from "statics/keys";
import { staticURLs } from "statics/url";

export default function ResumePanel() {
	const [context, setContext] = useState<string>("");
	const [modal, setModal] = useState<JSX.Element>();
	const [waiter, setWaiter] = useState(false);
	const { checkAccessAndRedirect, isLoading, userInfo, updateResume, removePortfolio } = useAccount();
	checkAccessAndRedirect();

	async function onUpdate(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (waiter) return;
		setWaiter(true);
		const parsed = zResumeUpdate.safeParse({ resumeContext: context });
		if (!parsed.success) return toast.warn(parsed.error.issues[0].message);
		await sleep(1000);
		await updateResume({ resumeContext: parsed.data.resumeContext });
		setWaiter(false);
	}

	function onRemove(imageName: string) {
		setModal(<ModalSubmit imageName={imageName} onCloseModal={() => setModal(undefined)}></ModalSubmit>);
	}

	useEffect(() => {
		if (userInfo) setContext(userInfo.resumeContext);
	}, [userInfo]);

	if (isLoading) return <LoadingSpinner />;
	return (
		<>
			<Form onSubmit={onUpdate}>
				<FormSection title="resume">
					<FormRichText value={context} onChange={setContext} />
					<ButtonBase>{waiter ? "... " : "update resume"}</ButtonBase>
				</FormSection>

				<FormSection title="portfolio pics">
					<ButtonBase type="button">
						<Link href={staticURLs.client.panel.resume.addImage}>add more pic to you portfolio</Link>
					</ButtonBase>
					<div className="rounded-theme-border overflow-hidden w-full max-w-3xl grid grid-cols-2 border border-theme-border  bg-theme-light gap-2 p-2">
						{userInfo?.portfolio.map((pic) => (
							<CardPortfo src={pic} key={pic} onRemove={onRemove} />
						))}
					</div>
				</FormSection>
			</Form>
			{modal}
		</>
	);
}

function CardPortfo({ src, onRemove }: { src: string; onRemove: (imageName: string) => void }) {
	return (
		<div className="w-full h-max overflow-hidden rounded-theme-border border border-theme-border relative">
			<span
				onClick={() => onRemove(src)}
				className="flex w-6 h-6 p-1 rounded-full bg-gray-50 opacity-70 border-theme-border border absolute  top-1 left-1 cursor-pointer active:opacity-50 fill-red-900"
			>
				<DeleteIcon />
			</span>
			<img className="w-full object-contain rounded-theme-border border border-theme-border" src={`${bucketUrl}/portfolio/${src}`} alt="portfolio" />
		</div>
	);
}

type modalPropsType = { imageName: string; onCloseModal: () => void };
function ModalSubmit({ onCloseModal, imageName }: modalPropsType) {
	const { removePortfolio } = useAccount();
	const [waiter, setWaiter] = useState(false);

	async function handleOnRemove() {
		if (waiter) return;
		setWaiter(true);
		await sleep(1000);
		await removePortfolio({ imageName });
		onCloseModal();
		setWaiter(false);
	}

	return (
		<Modal onOutClose={!waiter} onCloseModal={onCloseModal}>
			<div className="flex flex-col items-center gap-6 border border-theme-border rounded-theme-border overflow-hidden min-w-[20rem]  bg-white p-6">
				<p>are you sure about delete this pic?</p>
				{waiter && <LoadingSpinner />}
				<div className="flex gap-4 items-center">
					<ButtonBase onClick={handleOnRemove}>yes</ButtonBase>
					<ButtonBase onClick={() => !waiter && onCloseModal()}>no</ButtonBase>
				</div>
			</div>
		</Modal>
	);
}
