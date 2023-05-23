/* eslint-disable react-hooks/exhaustive-deps */
import { useAccount } from "@hooks/useAccount";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

export default function ConfirmNewEmail() {
	const router = useRouter();
	const { onValidateChangeEmail } = useAccount();

	useEffect(() => {
		if (router.isReady) {
			onValidateChangeEmail({ token: router.query.token });
		}
	}, [router]);
	return <div>Verifying</div>;
}
