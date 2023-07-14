import { ReactNode, useEffect, useRef, useState } from "react";

type selectPropsType = {
	onChange?: (option: selectOptionType) => void;
	onExtra?: (option: selectOptionType) => void;
	selectId: string;
	options?: selectOptionType[];
	preSelect?: selectOptionType;
};

export type selectOptionType = { value: number; label: string; extra?: ReactNode };

export default function Select({ preSelect, onChange, selectId, options, onExtra }: selectPropsType) {
	const [isOpen, setIsOpen] = useState(false);
	const [selected, setSelected] = useState<selectOptionType>(preSelect ? preSelect : { value: 0, label: "---" });
	const wrapperRef = useRef(null);

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [wrapperRef, options, preSelect]);

	function handleClickOutside(event: MouseEvent) {
		const currentNode: any = wrapperRef.current;
		if (currentNode !== undefined && !currentNode.contains(event.target)) setIsOpen(false);
	}

	return (
		<div
			className={`relative flex items-center justify-center bg-white text-theme-dark border  rounded-theme-border min-h-input w-full flex-1 ${
				isOpen ? "border-theme-select" : "border-theme-border"
			}`}
			ref={wrapperRef}
			onClick={() => {
				setIsOpen(!isOpen);
				const element = document.getElementById(selectId + selected.value);
				if (element) element.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
			}}
		>
			<div className="w-full flex items-center justify-between h-9 px-2 py-1 pr-3 gap-2">
				<div className="flex-1 block overflow-hidden whitespace-nowrap text-ellipsis text-center ">{selected.label}</div>

				<div className={`flex items-center justify-center w-3 h-3 cursor-pointer transition ${isOpen ? "rotate-0" : "rotate-180"}`}>^</div>
			</div>
			<div
				className={`absolute z-30 top-10 flex flex-col rounded-theme-border min-w-full border-theme-select transition-theme-select bg-white h-max  overflow-y-auto ${
					isOpen ? "border max-h-select opacity-100" : "border-0 max-h-0 opacity-0"
				} `}
			>
				{options?.map((option, index: number) => (
					<div
						className={`min-w-full w-max p-2 flex items-center justify-between cursor-pointer hover:bg-theme-select hover:text-theme-light ${
							selected.value === option.value ? "bg-theme-shade text-theme-light" : ""
						}`}
						key={index}
						id={selectId + option.value}
						onClick={() => {
							setIsOpen(false);
							setSelected(option);
							onChange && onChange(option);
						}}
					>
						{option.label}

						{option.extra && (
							<span
								// type="button"
								onClick={(e) => {
									e.stopPropagation();
									onExtra && onExtra(option);
								}}
							>
								{option.extra}
							</span>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
