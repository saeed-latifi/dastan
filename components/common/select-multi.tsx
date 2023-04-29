import CloseIcon from "@components/icons/close-icon";
import MinusIcon from "@components/icons/minus-icon";
import PlusIcon from "@components/icons/plus-icon";
import { useEffect, useRef, useState } from "react";

type selectPropsType = {
	onChange?: (options: selectOptionType[]) => void;
	options?: selectOptionType[];
	preSelect?: selectOptionType[];
};

export type selectOptionType = { value: number; label: string };

export default function SelectMulti({ preSelect = [], options = [], onChange }: selectPropsType) {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedItems, setSelectedItems] = useState<selectOptionType[]>(preSelect);

	const wrapperRef = useRef(null);

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [wrapperRef, options, preSelect]);

	function handleClickOutside(event: MouseEvent) {
		const currentNode: any = wrapperRef.current;
		if (currentNode !== undefined) {
			if (!currentNode.contains(event.target)) {
				setIsOpen(false);
			}
		}
	}

	function calcSelectedItems(option: selectOptionType) {
		let newArr: selectOptionType[] = [];
		let isSame = false;
		if (selectedItems) {
			selectedItems.map((cat) => {
				if (cat.value === option.value) isSame = true;
				else newArr.push(cat);
			});
		}
		if (!isSame) newArr.push(option);

		onChange && onChange(newArr);
		setSelectedItems(newArr);
	}

	function isSelected(option: selectOptionType) {
		let isSame = false;
		if (selectedItems) {
			selectedItems.map((cat) => {
				if (cat.value === option.value) isSame = true;
			});
		}
		return isSame;
	}

	return (
		<div
			className={`flex flex-col items-center justify-center bg-white text-dark border  rounded-input min-h-input w-full flex-1 ${
				isOpen ? "border-select" : "border-border"
			}`}
			ref={wrapperRef}
			onClick={() => {
				setIsOpen(!isOpen);
			}}
		>
			<div className="w-full flex justify-between h-max px-2 py-1 pr-3 gap-2">
				<div className="flex flex-1 flex-wrap items-center gap-2">
					{selectedItems.length > 0 ? (
						selectedItems?.map((op, index) => (
							<span key={index} className="flex gap-1 select-none items-center">
								{op.label}
								<span
									className="cursor-pointer select-none w-3 aspect-square"
									onClick={(e) => {
										calcSelectedItems(op);
										e.stopPropagation();
									}}
								>
									<MinusIcon />
								</span>
							</span>
						))
					) : (
						<span className="select-none text-gray-400 w-full text-center">select</span>
					)}
				</div>

				<div
					className={`flex items-center justify-center w-4 h-7 cursor-pointer transition ${
						isOpen ? "rotate-0" : "rotate-180"
					}`}
				>
					^
				</div>
			</div>
			<div className="relative w-full">
				<div
					className={`absolute z-30 top-2 flex flex-col rounded-input min-w-full border-select transition-border bg-white h-max  overflow-y-auto ${
						isOpen ? "border max-h-select opacity-100" : "border-0 max-h-0 opacity-0"
					} `}
				>
					{options.map((option, index: number) => (
						<div
							className={`w-full p-2 flex items-center justify-between cursor-pointer hover:bg-accent select-none`}
							key={index}
							onClick={(e) => {
								e.stopPropagation();
								calcSelectedItems(option);
							}}
						>
							<span>{option.label}</span>
							<span className=" aspect-square w-3">{isSelected(option) ? <CloseIcon /> : <PlusIcon />}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
