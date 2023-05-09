/* eslint-disable react-hooks/exhaustive-deps */
import ButtonBase, { BaseButtonVariety } from "@components/common/base-button";
import base64ToBlob from "@utilities/base64ToBlob";
import { ChangeEvent, useEffect, useState } from "react";
import AvatarEditor, { Position } from "react-avatar-editor";
import { toast } from "react-toastify";

type props = {
	preLoadURL?: string;
	onSubmit?: (blob: any) => void;
	width?: number;
	height?: number;
	label?: string;
};
export default function ImageCropper({ preLoadURL, onSubmit, width = 512, height = 512, label }: props) {
	const [position, sePosition] = useState<any>({ x: 0.5, y: 0.5 });
	const [scale, setScale] = useState<number>(1.0);
	const [editor, setEditor] = useState<AvatarEditor | null>(null);
	const [file, setFile] = useState<File | string>("");

	useEffect(() => {
		preLoadURL && setFile(preLoadURL);
		return () => {
			sePosition(null);
			setScale(0);
			setEditor(null);
			setFile("");
		};
	}, []);

	async function onHandleSubmit() {
		try {
			if (!editor || file === "") return toast.warn("please select an image");
			const dataUrl = editor.getImageScaledToCanvas().toDataURL();
			const blob = await base64ToBlob(dataUrl);
			onSubmit && onSubmit(blob);
			return blob;
		} catch (error) {
			console.log(error);

			toast.warn("bad image. try again!");
		}
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

	return (
		<div>
			<AvatarEditor
				className="w-full aspect-square flex relative  bg-white border border-slate-600 rounded-xl overflow-hidden"
				image={file}
				ref={(e) => setEditor(e)}
				scale={scale}
				width={width}
				height={height}
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
					select pic
				</ButtonBase>

				<ButtonBase onClick={onHandleSubmit} type="button" Variety={BaseButtonVariety.form}>
					{label ? label : "submit"}
				</ButtonBase>
			</div>
			<button></button>
			<input
				id="fileSelect"
				name="newImage"
				type="file"
				accept="image/*"
				crossOrigin="anonymous"
				onChange={(e) => {
					onAddImage(e);
				}}
				hidden
			/>
		</div>
	);
}
