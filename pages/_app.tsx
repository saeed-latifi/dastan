import { AppProps } from "next/app";
import RootLayout from "@components/layouts/layout";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css";
import "../styles/main.css";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<RootLayout>
			<ToastContainer />
			<Component {...pageProps} />
		</RootLayout>
	);
}
