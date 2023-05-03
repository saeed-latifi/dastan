import { useEffect, useState } from "react";

type props = {
	onChange?: (checked: boolean) => void;
	preChecked?: boolean;
	disabled?: boolean;
	id?: string;
};

export default function Toggle({ id, onChange, preChecked = false, disabled = false }: props) {
	const [checked, setChecked] = useState(preChecked);

	useEffect(() => {
		setChecked(preChecked);
	}, [preChecked, disabled]);

	return (
		<label
			className={`relative select-none cursor-pointer  w-8 p-[1px] border  rounded-full flex ${
				checked ? "bg-theme-select border-theme-select justify-end" : "bg-white border-theme-border justify-start"
			}`}
		>
			<input
				disabled={disabled}
				type="checkbox"
				id={id}
				onChange={() => {
					onChange && onChange(!checked);
					setChecked(!checked);
				}}
				checked={checked}
				hidden
			/>

			<div className={`w-3 h-3 rounded-full shadow-theme-dark  ${checked ? "bg-theme-accent" : "bg-theme-shade"}`}></div>
		</label>
	);
}
