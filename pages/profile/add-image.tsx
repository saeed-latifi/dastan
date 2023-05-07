/* eslint-disable react-hooks/exhaustive-deps */
import LoaderSpinner from "@components/common/loader-spinner";
import ImageCropper from "@components/image-crapper";
import { useAccount } from "@hooks/useAccount";
import { useProfileImageParam } from "@hooks/useProfileImageParam";
import { useState } from "react";

export default function ProfileImageCropper() {
	const { checkAccessRedirect, isLoading, userInfo } = useAccount();
	const { onUpdateProfileImage, profileImageParam } = useProfileImageParam();
	checkAccessRedirect();
	const [waiter, setWaiter] = useState(false);

	async function onSubmit(blob: any) {
		if (!blob) return;
		const form = new FormData();
		form.append("image", blob);
		await onUpdateProfileImage({ formData: form });
		setWaiter(false);
	}

	if (isLoading) return <LoaderSpinner />;

	return (
		<>
			{!isLoading && (
				<ImageCropper
					preLoadURL={`/images/profile/${userInfo.slug}/${profileImageParam}.webp`}
					onSubmit={(blob) => onSubmit(blob)}
					label={waiter ? "..." : "save"}
				/>
			)}
		</>
	);
}
