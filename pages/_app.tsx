import { AppProps } from "next/app";
import RootLayout from "@components/layouts/layout";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css";
import "../styles/main.css";
import { ModalProvider } from "@providers/contexts/ModalContext";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ModalProvider>
			<RootLayout>
				<ToastContainer />

				<Component {...pageProps} />
			</RootLayout>
		</ModalProvider>
	);
}
