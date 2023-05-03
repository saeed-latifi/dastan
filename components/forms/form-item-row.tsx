import CloseIcon from "@components/icons/close-icon";

type itemRowProps = { index: number; title: string; onClick: (index: number) => void };
export default function FormItemRow({ index, title, onClick }: itemRowProps) {
	return (
		<div key={index} className="w-full flex items-center justify-between px-3 ">
			<span>{title}</span>
			<CloseIcon className="w-4 h-4 cursor-pointer" onClick={() => onClick(index)}></CloseIcon>
		</div>
	);
}
