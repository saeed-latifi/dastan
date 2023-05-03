type Props = {
	labelText?: string;
	register?: any;
	warnings?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;
export default function TextArea({ register, warnings, labelText, ...props }: Props) {
	return (
		<div className="flex flex-col items-start gap-1 w-full">
			{labelText && (
				<label className="flex items-center gap-1" htmlFor={props.id || labelText}>
					{props.required && <span className="text-theme-warn">*</span>}
					{labelText}
				</label>
			)}

			<textarea
				{...props}
				id={props.id || labelText}
				{...register}
				className=" border-theme-border focus:border-theme-select focus:shadow-theme-dark rounded-theme-border outline-none border px-2 py-1  min-w-0 w-full min-h-input"
			/>
			{warnings && <p className="text-theme-warn">{warnings}</p>}
		</div>
	);
}
