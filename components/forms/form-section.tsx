type Props = { title: string } & React.HTMLAttributes<HTMLDivElement>;

export default function FormSection({ title, ...props }: Props) {
	return (
		<div className="w-full flex flex-col gap-2 ">
			<p className="px-2 border-b border-x-gray-500 font-semibold text-theme-dark">{title}</p>
			<div className="flex flex-col gap-2 px-2">{props.children}</div>
		</div>
	);
}
