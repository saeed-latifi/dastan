import { AppProps } from "next/app";
import RootLayout from "@components/layouts/layout";
import Interceptor from "@providers/interceptor";
import { ToastContainer } from "react-toastify";

import "../styles/main.css";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<Interceptor>
			<RootLayout>
				<ToastContainer />
				<Component {...pageProps} />
			</RootLayout>
		</Interceptor>
	);
}
