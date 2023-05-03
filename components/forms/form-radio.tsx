import Radio from "@components/common/radio-button";

type props<T> = {
	onChange?: (value: T) => void;
	selected?: T;
	label?: string;
	value: T;
};

export default function FormRadio<T>({ value, label, onChange, selected }: props<T>) {
	return (
		<div className="flex items-center  gap-2">
			<label className="select-none cursor-pointer" htmlFor={label + "radioId"}>
				{label}
			</label>
			<Radio id={label + "radioId"} value={value} onChange={onChange} selected={selected} />
		</div>
	);
}
