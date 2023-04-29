import { useAccount } from "@hooks/useAccount";
import Link from "next/link";

export default function FooterMain() {
	const { isLoggedIn, permissionLevel } = useAccount();

	return (
		<div className="grow-0 w-full flex items-center justify-center sticky z-10 bottom-0 bg-shade text-accent border-t border-border ">
			<ul className="max-w-7xl flex flex-1 p-2 h-max items-center justify-evenly min-h-[3rem]">
				<FooterLink href="/" text="home" />
				<FooterLink href="/school" text="school" />
				<FooterLink href="/blog" text="blog" />
				<FooterLink href="/news" text="news" />
				{isLoggedIn && <FooterLink href="/profile" text="profile" />}
				{permissionLevel > 15 && <FooterLink href="/admin" text="admin" />}
			</ul>
		</div>
	);
}

function FooterLink({ text, href }: { text: string; href: string }) {
	return (
		<li className="footer_link">
			<Link href={href}>{text}</Link>
		</li>
	);
}
