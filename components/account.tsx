import Link from "next/link";
import { useAccount } from "@hooks/useAccount";
import ProfileImage from "./images/profile-image";
import { staticURLs } from "statics/url";

export default function Account() {
	const { isLoading, userInfo, onLogout, isLoggedIn } = useAccount();

	if (isLoading) return <div className="btn">...</div>;

	if (isLoggedIn) {
		return (
			<div className="flex gap-2 items-center justify-between w-full px-4">
				<div className="flex items-center gap-2">
					<ProfileImage slug={userInfo.slug} />
					<Link href={staticURLs.client.profile.base}>profile</Link>
				</div>
				<span
					className="cursor-pointer"
					onClick={() => {
						onLogout();
					}}
				>
					SignOut
				</span>
			</div>
		);
	}

	return (
		<Link href={staticURLs.client.login} className="btn">
			log in
		</Link>
	);
}
