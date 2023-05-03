import { useEffect, useRef, useState } from "react";

type props = {
	uniqueId: string;
	contents?: popupContentType[];
	label: string;
	preSelected?: popupContentType;
};

type popupContentType = {
	id: number;
	title: string;
	onChange?: (id: number) => void;
};

export default function Popup({ uniqueId, contents, label, preSelected }: props) {
	const [isOpen, setIsOpen] = useState(false);
	const [selected, setSelected] = useState(preSelected);

	const wrapperRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [wrapperRef, selected]);

	function handleClickOutside(event: any) {
		if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
			setIsOpen(false);
		}
	}

	return (
		<div ref={wrapperRef} className="relative flex items-center z-50 cursor-pointer" id={"box" + uniqueId}>
			<label className="flex items-center px-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
				{label}
			</label>

			<div
				className={`absolute top-7 left-0 bg-white border-theme-border rounded-theme-border flex items-start justify-between flex-col -z-60 overflow-hidden min-w-theme-small w-max h-max  transition-theme-select
					${isOpen ? "max-h-40 border" : "max-h-0 border-0"}`}
			>
				{contents?.map((c) => (
					<label
						key={c.id}
						className={`flex items-center justify-between p-2 w-full cursor-pointer select-none hover:bg-theme-shade hover:text-white
							${c.id === selected?.id ? "bg-theme-select text-white" : "bg-white text-theme-select"}`}
						onClick={() => {
							c.onChange && c.onChange(c.id);
							setIsOpen(false);
							setSelected(c);
						}}
					>
						{c.title}
					</label>
				))}
			</div>
		</div>
	);
}
