import { ReactNode, createContext, useState } from "react";

type MOdalContextType = { modal: JSX.Element | undefined; onCloseModal: () => void; setModal: (modal: JSX.Element) => void };

const ModalContext = createContext<MOdalContextType>({ modal: undefined, onCloseModal() {}, setModal() {} });

function ModalProvider({ children }: { children: ReactNode }) {
	const [modal, setModal] = useState<JSX.Element>();

	return (
		<ModalContext.Provider value={{ modal, onCloseModal: () => setModal(undefined), setModal }}>
			{children}
			{modal}
		</ModalContext.Provider>
	);
}

export { ModalContext, ModalProvider };

//
