import Link from "next/link";
import { useAccount } from "@hooks/useAccount";
import ProfileImage from "./images/profile-image";
import { staticURLs } from "statics/url";
import LoadingSpinner from "./common/loader-spinner";
import { staticUIText } from "statics/ui-text";

export default function Account() {
	const { isLoading, userInfo } = useAccount();

	if (isLoading) return <LoadingSpinner />;
	if (userInfo) {
		return (
			<div className="flex items-center gap-2">
				<ProfileImage image={userInfo.image} />
				<Link href={staticURLs.client.account.base}>{staticUIText.navbar.profile}</Link>
			</div>
		);
	}

	return (
		<Link href={staticURLs.client.login} className="btn">
			{staticUIText.navbar.login}
		</Link>
	);
}
