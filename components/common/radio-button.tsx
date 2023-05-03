import CheckIcon from "@components/icons/check-icon";

type props<T> = {
	onChange?: (value: T) => void;
	selected?: T;
	id?: string;
	value: T;
};

export default function Radio<T>({ value, onChange, selected, id }: props<T>) {
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
			<CheckIcon className={`transition-theme-check ${value === selected ? "opacity-100 scale-100" : "opacity-0 scale-0"}`} />
		</label>
	);
}
