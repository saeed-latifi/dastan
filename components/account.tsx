import Link from "next/link";
import { useAccount } from "@hooks/useAccount";
import ProfileImage from "./images/profile-image";
import { staticURLs } from "statics/url";
import { staticUIText } from "statics/ui-text";
import LoadingSpinner from "./icons/LoadingSpinner";

export default function Account() {
	const { isLoading, userInfo } = useAccount();
	if (isLoading) return <LoadingSpinner />;
	if (userInfo) {
		return (
			<div className="flex items-center gap-2">
				<Link href={staticURLs.client.account.base}>{userInfo.username}</Link>
				<Link href={staticURLs.client.account.base}>
					<ProfileImage image={userInfo.image} />
				</Link>
			</div>
		);
	}

	return (
		<Link href={staticURLs.client.login} className="btn">
			{staticUIText.navbar.login}
		</Link>
	);
}
