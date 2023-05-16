/* eslint-disable react-hooks/exhaustive-deps */
import ButtonBase, { BaseButtonVariety } from "@components/common/base-button";
import LoaderSpinner from "@components/common/loader-spinner";
import Form from "@components/forms/form";
import { useAccount } from "@hooks/useAccount";
import { useImage } from "@hooks/useImage";
import base64ToBlob from "@utilities/base64ToBlob";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import AvatarEditor, { Position } from "react-avatar-editor";
import { toast } from "react-toastify";
import { landscapeImage } from "statics/measures";

export default function TeamLogoCropper() {
	const { checkAccessRedirect, isLoading } = useAccount();
	const { onUpdateCourseImage } = useImage();
	checkAccessRedirect();

	const router = useRouter();

	const [position, sePosition] = useState({ x: 0.5, y: 0.5 });
	const [scale, setScale] = useState<number>(1.0);
	const [editor, setEditor] = useState<AvatarEditor | null>(null);
	const [waiter, setWaiter] = useState(false);
	const [file, setFile] = useState<File | string>("");

	async function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		try {
			if (!editor || file === "") return toast.warn("please select an image");
			setWaiter(true);
			const dataUrl = editor.getImageScaledToCanvas().toDataURL();
			const blob = await base64ToBlob(dataUrl);
			const form = new FormData();
			form.append("image", blob);
			form.append("id", router.query.item as string);
			await onUpdateCourseImage({ formData: form });
			setWaiter(false);
		} catch (error) {}
	}

	function handleScale(event: ChangeEvent<HTMLInputElement>) {
		const scale = parseFloat(event.target.value);
		setScale(scale);
	}

	function handlePositionChange(position: Position) {
		sePosition(position);
	}

	const onAddImage = async (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];
			setFile(file);
		}
	};

	if (isLoading) return <LoaderSpinner />;

	return (
		<Form onSubmit={onSubmit} style={{ maxWidth: "32rem" }}>
			<AvatarEditor
				className="w-full aspect-video flex relative  bg-white bg-theme-team-logo border border-theme-border rounded-theme-border overflow-hidden"
				image={file}
				ref={(e) => setEditor(e)}
				scale={scale}
				width={landscapeImage.width}
				height={landscapeImage.height}
				position={position}
				backgroundColor="white"
				onPositionChange={handlePositionChange}
				border={30}
				borderRadius={9999}
				style={{
					width: "100%",
					height: "100%",
				}}
			/>
			<div className="w-full flex flex-1 flex-col sm:items-center justify-between gap-4 py-4 sm:flex-row sm:gap-2">
				<input
					className="zoomer-slide"
					name="scale"
					type="range"
					onChange={handleScale}
					min="1"
					max="5"
					step="0.01"
					defaultValue="1"
				/>

				<ButtonBase type="button" onClick={() => document.getElementById("fileSelect")?.click()}>
					select
				</ButtonBase>

				<ButtonBase type="submit" Variety={BaseButtonVariety.form}>
					{waiter ? "..." : "save"}
				</ButtonBase>
			</div>
			<input
				id="fileSelect"
				name="newImage"
				type="file"
				accept="image/*"
				onChange={(e) => {
					onAddImage(e);
				}}
				hidden
			/>
		</Form>
	);
}
