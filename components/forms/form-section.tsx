type Props = { title: string } & React.HTMLAttributes<HTMLDivElement>;

export default function FormSection({ title, ...props }: Props) {
	return (
		<div className="w-full flex flex-col gap-2">
			<p className="mx-2 border-b border-x-gray-500 font-semibold text-theme-dark">{title}</p>
			{props.children}
		</div>
	);
}
