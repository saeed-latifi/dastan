import Account from "@components/account";
import { useAccount } from "@hooks/useAccount";
import Link from "next/link";

export default function HeaderMain() {

	const { isLoggedIn, permissionLevel } = useAccount();

	return (
		<div className="grow-0 w-full flex items-center justify-center sticky z-10 top-0 px-10 bg-theme-light-gray text-theme-select border-b border-theme-border">
			<ul className="max-w-7xl flex flex-1 p-2 h-max items-center justify-evenly text-sm">
				<HeaderLink href="/" text="خانه" />
				<HeaderLink href="/school" text="آگهی ها" />
				<HeaderLink href="/news" text="انجمن" />
				<HeaderLink href="/blog" text="وبلاگ" />
				<HeaderLink href="/about" text="درباره ما" />
				{isLoggedIn && <HeaderLink href="/profile" text="پروفایل" />}
				{permissionLevel > 15 && <HeaderLink href="/admin" text="مدیریت" />}
			</ul>
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