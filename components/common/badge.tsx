import CloseIcon from "@components/icons/close-icon";

type props = {
	title: string;
	onDelete?: () => void;
};
export default function Badge({ title, onDelete }: props) {
	return (
		<div className="flex items-center px-1  gap-2 select-none border rounded-theme-border border-theme-border overflow-hidden hover:border-theme-select">
			<p>{title}</p>
			<CloseIcon onClick={onDelete} className="w-4 h-4 cursor-pointer active:opacity-70" />
		</div>
	);
}
