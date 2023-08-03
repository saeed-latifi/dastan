/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useEffect, useState } from "react";

type props = {
	onCloseModal?: () => void;
	onOutClose?: boolean;
	children: ReactNode;
};
// & React.HTMLAttributes<HTMLDivElement>;

export default function Modal({ children, onCloseModal, onOutClose = true }: props) {
	const wrapper = "w-full h-full overflow-y-auto bg-fixed transition-all bg-black";
	const wrapperClose = wrapper + " " + "bg-opacity-0";
	const wrapperOpen = wrapper + " " + "bg-opacity-70";

	const back = "flex items-center justify-center px-4 py-12 w-full h-max min-h-full transition-all opacity-0";
	const backClose = back + " " + " opacity-0  scale-90";
	const backOpen = back + " " + " opacity-100 scale-100";

	const [backgroundStyle, setBackgroundStyle] = useState(backClose);
	const [wrapperStyle, setWrapperStyle] = useState(wrapperClose);
	const [onClose, setOnClose] = useState(false);

	useEffect(() => {
		setBackgroundStyle(backOpen);
		setWrapperStyle(wrapperOpen);
		document.body.style.overflow = "hidden";
		// document.documentElement.style.overflowY = "hidden";
		return () => {
			document.body.style.overflow = "unset";
			// document.documentElement.style.overflowY = "scroll";
			setBackgroundStyle("");
			setWrapperStyle("");
		};
	}, []);

	return (
		<div className="fixed top-0 right-0 bottom-0 left-0 z-40 bg-fixed ">
			<div
				className={wrapperStyle}
				onClick={() => {
					if (onOutClose) {
						setOnClose(true);
						setBackgroundStyle(backClose);
						setWrapperStyle(wrapperClose);
					}
				}}
			>
				<div onTransitionEnd={() => onClose && onCloseModal && onCloseModal()} className={backgroundStyle}>
					<div className="flex items-center justify-center max-w-full" onClick={(e) => e.stopPropagation()}>
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}
