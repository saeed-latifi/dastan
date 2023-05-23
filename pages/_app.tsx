import { AppProps } from "next/app";
import RootLayout from "@components/layouts/layout";
import { ToastContainer } from "react-toastify";

import "../styles/main.css";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<RootLayout>
			<ToastContainer />
			<Component {...pageProps} />
		</RootLayout>
	);
}
