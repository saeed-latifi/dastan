import CheckIcon from "@components/icons/check-icon";

type props = {
	onChange?: (value: string | number) => void;
	selected?: string | number;
	id?: string;
	value: string | number;
};

export default function Radio({ value, onChange, selected, id }: props) {
	return (
		<label
			htmlFor={id}
			className=" cursor-pointer w-4 h-4 border-2 border-theme-border rounded-full bg-white flex items-center justify-center"
		>
			<input
				type="checkbox"
				id={id}
				onChange={() => {
					onChange && onChange(value);
				}}
				hidden
			/>
			<CheckIcon
				className={`transition-theme-check duration-theme-slow + ${
					value === selected ? "opacity-100 scale-100" : "opacity-0 scale-0"
				}`}
			/>
		</label>
	);
}
