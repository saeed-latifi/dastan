import Toggle from "@components/common/toggle-button";

type props = {
	onChange?: (checked: boolean) => void;
	preChecked?: boolean;
	disabled?: boolean;
	title: string;
};
export default function FormToggle({ title, onChange, preChecked = false, disabled = false }: props) {
	return (
		<div className="w-full flex items-center justify-between">
			<label className="select-none cursor-pointer" htmlFor={title + "toggleId"}>
				{title}
			</label>
			<Toggle id={title + "toggleId"} onChange={onChange} preChecked={preChecked} disabled={disabled} />
		</div>
	);
}
