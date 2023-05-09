/* eslint-disable @next/next/no-head-element */

import Head from "next/head";
import FooterMain from "./FooterMain";
import HeaderMain from "./HeaderMain";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="items-center flex flex-col h-max min-h-screen w-full z-0 bg-theme-light text-theme-dark">
			<Head>
				<meta charSet="UTF-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0 " />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="theme-color" content="#030521" />
				<title>dastan game Community</title>
			</Head>
			<HeaderMain />
			<main className="flex flex-col items-center p-1 flex-1 w-full max-w-7xl">{children}</main>
			<FooterMain />
		</div>
	);
}
