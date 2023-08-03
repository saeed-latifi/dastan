/* eslint-disable react-hooks/exhaustive-deps */
import ButtonBase, { BaseButtonVariety } from "@components/common/base-button";
import LoadingSpinner from "@components/icons/LoadingSpinner";
import Form from "@components/forms/form";
import Navigation from "@components/navigation";
import { useAccount } from "@hooks/useAccount";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { staticURLs } from "statics/url";

export default function ProfileImageCropper() {
	const { checkAccessAndRedirect, isLoading, addPortfolio } = useAccount();
	checkAccessAndRedirect();

	const [waiter, setWaiter] = useState(false);
	const [file, setFile] = useState<File>();
	const [url, setUrl] = useState<string>();

	async function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (waiter) return;
		if (!file) return toast.warn("please select a pic first");
		setWaiter(true);
		try {
			const form = new FormData();
			form.append("image", file);
			await addPortfolio({ formData: form });
		} catch (error) {}
		setWaiter(false);
	}

	const onAddImage = async (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];

			if (file) {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.addEventListener("load", () => {
					if (reader.result && typeof reader.result === "string") setUrl(reader.result);
				});
			}
			setFile(file);
		}
	};

	if (isLoading) return <LoadingSpinner />;

	return (
		<Form onSubmit={onSubmit} style={{ maxWidth: "32rem" }}>
			<Navigation label="" path={staticURLs.client.panel.resume.base} />

			<img src={url} alt="" />
			<div className="w-full flex flex-1 flex-col sm:items-center justify-between gap-4 py-4 sm:flex-row sm:gap-2">
				<ButtonBase type="button" onClick={() => document.getElementById("fileSelect")?.click()}>
					select
				</ButtonBase>

				<ButtonBase type="submit" Variety={BaseButtonVariety.form}>
					{waiter ? "..." : "save"}
				</ButtonBase>
			</div>
			<input id="fileSelect" name="newImage" type="file" accept="image/*" onChange={onAddImage} hidden />
		</Form>
	);
}
