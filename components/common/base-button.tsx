type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { Variety?: BaseButtonVariety };
export enum BaseButtonVariety {
	primary,
	form,
}
export default function ButtonBase({ Variety = BaseButtonVariety.primary, ...props }: Props) {
	return (
		<button
			{...props}
			className={`${typeRender(
				Variety
			)} flex items-center justify-center rounded-theme-border outline-none py-2 px-4 align-middle  min-w-theme-medium active:opacity-70  bg-theme-form ${
				props.className
			}`}
		/>
	);
}

function typeRender(Variety: BaseButtonVariety) {
	switch (Variety) {
		case BaseButtonVariety.primary:
			return "text-white bg-theme-shade hover:bg-theme-select";

		case BaseButtonVariety.form:
			return "bg-theme-form text-white hover:bg-theme-select";

		default:
			break;
	}
}
