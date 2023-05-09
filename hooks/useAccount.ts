import { useRouter } from "next/router";
import useSWR from "swr";
import HTTPService from "@providers/HTTPService";
import { iPasswordUpdate, iPhone, iResetPassword, iUserCreate, iUserEmail, iUserLogin, iUserUpdate } from "@models/iUser";
import nullPurger from "@utilities/nullPurger";
import { toast } from "react-toastify";
import { errorMutateHandler, errorPurgerMutateHandler, fetchHandler, okMutateHandler } from "./useFetch";

export function useAccount() {
	const router = useRouter();

	const {
		data: userInfo,
		error: userErr,
		isLoading,
		mutate: userMutate,
	} = useSWR("userAuth", onIdentify, {
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
	});

	async function onIdentify() {
		try {
			const { data } = await HTTPService.get("account");
			return data;
		} catch (error: any) {
			toast.warn("bad connection");
		}
	}

	function onLogin({ email, password }: iUserLogin) {
		fetchHandler({
			fetcher: () => HTTPService.put("account", { email, password }),
			onOK: (data) => {
				okMutateHandler({ data, mutator: userMutate });
				router.push("/");
			},
			okMessage: "logged in",
		});
	}

	function onLogout() {
		fetchHandler({
			fetcher: () => HTTPService.delete("account"),
			onOK: (data) => {
				okMutateHandler({ data, mutator: userMutate });
				router.push("/");
				router.reload();
			},
			okMessage: "logged out",
		});
	}

	async function onActiveUser({ token }: any) {
		fetchHandler({
			fetcher: () => HTTPService.put("account/email", { token }),
			onOK: (data) => {
				okMutateHandler({ data, mutator: userMutate });
				router.push("/");
			},
		});
	}

	async function onUpdateUser(body: iUserUpdate) {
		fetchHandler({
			fetcher: () => HTTPService.patch(`account`, body),
			onOK: (data) => okMutateHandler({ data, mutator: userMutate }),
			onError: (error) => errorMutateHandler({ error, mutator: userMutate }),
		});
	}

	async function onRegister(body: iUserCreate) {
		fetchHandler({
			fetcher: () => HTTPService.post("account", body),
			onOK: () => router.push("/profile/welcome"),
			onError: (error) => errorMutateHandler({ error, mutator: userMutate }),
			okMessage: "your account created. please check your email inbox for verification mail",
		});
	}

	// password
	async function onUpdatePassword(body: iPasswordUpdate) {
		fetchHandler({
			fetcher: () => HTTPService.patch(`account/password`, body),
		});
	}

	async function onRecoverPasswordRequest(body: iUserEmail) {
		fetchHandler({
			fetcher: () => HTTPService.post("account/password", body),
			onOK: () => router.push("/"),
		});
	}

	async function onResetPassword(args: iResetPassword) {
		const body = { ...args, token: router.query.token };
		fetchHandler({
			fetcher: () => HTTPService.put("account/password", body),
			onOK: () => router.push("/login"),
		});
	}

	// email
	async function onResendActivationEmail(body: iUserEmail) {
		fetchHandler({
			fetcher: () => HTTPService.get("account/email", { params: body }),
			onOK: () => router.push("/"),
		});
	}

	async function onRequestChangeEmail(body: iUserLogin) {
		fetchHandler({
			fetcher: () => HTTPService.post("account/email", body),
			onOK: () => router.push("/profile/change-request-send"),
		});
	}

	async function onValidateChangeEmail({ token }: any) {
		fetchHandler({
			fetcher: () => HTTPService.patch("account/email", { token }),
			onOK: (data) => {
				okMutateHandler({ data, mutator: userMutate });
				router.push("/");
			},
		});
	}

	// otp
	async function onSendOTP(body: iPhone) {
		fetchHandler({
			fetcher: () => HTTPService.post("account/phone", body),
			onOK: () => router.push("/profile/check-otp"),
		});
	}

	async function onCheckOTP(otp: any) {
		fetchHandler({
			fetcher: () => HTTPService.patch("account/phone", { otp }),
			onOK: (data) => {
				okMutateHandler({ data, mutator: userMutate });
				router.push("/");
			},
		});
	}

	// access
	function checkAccessRedirect(permissionLevel = 0) {
		if (!isLoading && !userInfo?.data) return router.push("/login");
		if (userInfo?.data?.permissionLevel < permissionLevel) return router.push("/403");
	}

	function hasAccess(requirePermissionLevel: number) {
		const hasAccess = userInfo?.data?.permissionLevel < requirePermissionLevel ? false : true;
		return hasAccess;
	}
	function onErrorPurge(errorKey: string) {
		errorPurgerMutateHandler({ errorKey, mutator: userMutate });
	}

	return {
		onLogin,
		onLogout,
		onRegister,
		onActiveUser,
		checkAccessRedirect,
		hasAccess,
		onUpdateUser,
		onUpdatePassword,
		onResendActivationEmail,
		onRecoverPasswordRequest,
		onResetPassword,
		onRequestChangeEmail,
		onValidateChangeEmail,
		onSendOTP,
		onCheckOTP,
		onErrorPurge,
		userInfo: userInfo?.data ? nullPurger(userInfo.data) : false,
		isLoading: isLoading,
		isLoggedIn: userInfo?.data,
		permissionLevel: userInfo?.data?.permissionLevel || 0,
		// TODO check
		error: userInfo?.error || userErr,
	};
}
