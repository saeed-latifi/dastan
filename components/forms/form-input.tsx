type Props = {
	labelText?: string;
	register?: any;
	warnings?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function FormInput({ labelText, warnings, register, ...props }: Props) {
	return (
		<div className="flex flex-col items-start gap-1 w-full">
			{labelText && (
				<label className="flex items-center gap-1" htmlFor={props.id || labelText}>
					{props.required && <span className="text-warn">*</span>}
					{labelText}
				</label>
			)}
			<input
				{...props}
				id={props.id || labelText}
				{...register}
				className=" border-border focus:border-select rounded-input outline-none border px-2 py-1  min-w-0 w-full min-h-input"
			/>
			{warnings && <p className="text-warn">{warnings}</p>}
		</div>
	);
}
