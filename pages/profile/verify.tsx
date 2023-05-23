/* eslint-disable react-hooks/exhaustive-deps */
import { useAccount } from "@hooks/useAccount";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

export default function Verify() {
	const router = useRouter();
	const { onActiveUser } = useAccount();

	useEffect(() => {
		if (router.isReady) {
			onActiveUser({ token: router.query.token });
		}
	}, [router]);
	return <div>Verifying</div>;
}
