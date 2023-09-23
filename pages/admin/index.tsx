import ButtonBase from "@components/common/base-button";
import { useAccount } from "@hooks/useAccount";
import { useRouter } from "next/router";
import React from "react";
import { staticURLs } from "statics/url";

export default function AdminPage() {
	const { checkAccessAndRedirect } = useAccount();
	checkAccessAndRedirect("ADMIN");
	const router = useRouter();

	return (
		<div className="flex flex-col w-full max-w-theme gap-4 p-4">
			<ButtonBase type="button" onClick={() => router.push(staticURLs.client.admin.messages.base)}>
				admin messages
			</ButtonBase>

			<ButtonBase type="button" onClick={() => router.push(staticURLs.client.admin.tickets.base)}>
				admin tickets
			</ButtonBase>

			<ButtonBase type="button" onClick={() => router.push(staticURLs.client.admin.users.base)}>
				usersList
			</ButtonBase>
		</div>
	);
}
