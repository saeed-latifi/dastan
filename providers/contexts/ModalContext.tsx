import { ReactNode, createContext, useState } from "react";

type MOdalContextType = { modal: JSX.Element | undefined; onCloseModal: () => void; setModal: (modal: JSX.Element) => void };

const ModalContext = createContext<MOdalContextType>({ modal: undefined, onCloseModal() {}, setModal() {} });

function useModal() {
	const [modal, setModal] = useState<JSX.Element>();
	function onCloseModal() {
		console.log("onClose!!!");

		setModal(undefined);
	}

	return;
}

function ModalProvider({ children }: { children: ReactNode }) {
	const [modal, setModal] = useState<JSX.Element>();
	function onCloseModal() {
		console.log("onClose!!!");

		setModal(undefined);
	}

	return (
		<ModalContext.Provider value={{ modal, onCloseModal, setModal }}>
			{children}
			{modal}
		</ModalContext.Provider>
	);
}

export { ModalContext, ModalProvider };

//
