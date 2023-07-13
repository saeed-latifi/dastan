import Account from "@components/account";
import Link from "next/link";
import { staticUIText } from "statics/ui-text";
import { staticURLs } from "statics/url";

export default function HeaderMain() {
	return (
		<div className="grow-0 w-full flex items-center justify-center sticky z-10 top-0 px-4 py-2 bg-theme-light-gray text-theme-select border-b border-theme-border">
			<div className="max-w-7xl flex flex-1 h-max items-center justify-between">
				<div className="flex items-center gap-8">
					<Link href={staticURLs.client.home}>{staticUIText.navbar.home}</Link>
					<Link href={staticURLs.client.feed.courses}>{staticUIText.navbar.courses}</Link>
					<Link href={staticURLs.client.feed.jobs}>{staticUIText.navbar.jobs}</Link>
				</div>
				<Account />
			</div>
		</div>
	);
}
