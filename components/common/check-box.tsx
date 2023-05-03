import CheckIcon from "@components/icons/check-icon";
import { useEffect, useState } from "react";

type props = {
	onChange?: (checked: boolean) => void;
	preChecked?: boolean;
	id?: string;
};

export default function CheckBox({ id, onChange, preChecked = false }: props) {
	const [checked, setChecked] = useState(preChecked);

	useEffect(() => {
		setChecked(preChecked);
	}, [preChecked]);

	return (
		<label
			htmlFor={id}
			className=" cursor-pointer w-4 h-4 border-2 border-theme-border rounded-theme-border bg-white flex items-center justify-center"
		>
			<input
				type="checkbox"
				id={id}
				onChange={() => {
					setChecked(!checked);
					onChange && onChange(!checked);
				}}
				checked={checked}
				hidden
			/>
			<CheckIcon className={`transition-theme-check duration-theme-slow + ${checked ? "opacity-100 scale-100" : "opacity-0 scale-0"}`} />
		</label>
	);
}
