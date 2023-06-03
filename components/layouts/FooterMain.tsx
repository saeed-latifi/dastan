import Link from "next/link";
import { staticURLs } from "statics/url";

export default function FooterMain() {
	return (
		<div className="grow-0 w-full flex items-center justify-center sticky z-10 bottom-0 bg-theme-shade text-theme-accent border-t border-theme-border ">
			<ul className="max-w-7xl flex flex-1 p-2 h-max items-center justify-evenly min-h-[3rem]">
				<FooterLink href={staticURLs.client.home} text="home" />
				<FooterLink href={staticURLs.client.feed.course} text="course" />
				{/*<FooterLink href="/blog" text="blog" />
				<FooterLink href="/news" text="news" /> */}
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
