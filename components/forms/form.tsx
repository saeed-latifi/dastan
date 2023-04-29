type Props = React.FormHTMLAttributes<HTMLFormElement>;

export default function Form({ ...props }: Props) {
	return (
		<form {...props} className="flex flex-col gap-4 max-w-sm w-full items-center py-4">
			{props.children}
		</form>
	);
}
