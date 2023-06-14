import Account from "@components/account";
import Link from "next/link";

export default function HeaderMain() {
	return (
		<div className="grow-0 w-full flex items-center justify-center sticky z-10 top-0 px-10 bg-theme-light-gray text-theme-select border-b border-theme-border">
			<div className="max-w-7xl flex flex-1 p-2 h-max items-center justify-end">
				<Account />
			</div>
		</div>
	);
}

function HeaderLink({ text, href }: { text: string; href: string }) {
	return (
		<li className="header_link pl-6">
			<Link href={href}>{text}</Link>
		</li>
	);
}
