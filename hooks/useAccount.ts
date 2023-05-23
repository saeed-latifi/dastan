import { useRouter } from "next/router";
import useSWR from "swr";
import HTTPService from "@providers/HTTPService";
import { iPasswordUpdate, iPhone, iResetPassword, iUserCreate, iUserEmail, iUserLogin, iUserUpdate } from "@models/iUser";
import { apiResponse, responseState } from "@providers/apiResponseHandler";
import nullPurger from "@utilities/nullPurger";
import { toast } from "react-toastify";

export function useAccount() {
	const router = useRouter();
	// const [forceChangeParam, setForceChangeParam] = useState(1);
	const { data: imgParam, mutate: imgMutate } = useSWR("forceChangeParam", imgParamGenerator, {
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
	});

	function imgParamGenerator() {
		const date = new Date();
		const milliseconds = date.getTime();
		return milliseconds;
	}

	async function onImageChange({ formData }: { formData: FormData }) {
		const { data } = await HTTPService.post("/account/image", formData);
		if (data.resState === responseState.ok) {
			imgMutate(imgParamGenerator, {
				populateCache(result, _) {
					return result;
				},
				revalidate: false,
			});
			toast.success("image uploaded.");
		} else {
			toast.warn("image upload failed!");
		}
	}

	const {
		data: userInfo,
		error,
		isLoading,
		mutate,
	} = useSWR("userAuth", onIdentify, {
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
	});

	function mutateHandler(fetcher: () => any) {
		mutate(
			async () => {
				try {
					const { data } = await fetcher();
					if (data.resState === responseState.ok) {
						router.push("/");
					}
					if (data.resState === responseState.error) toast.warn(data.error);
					return data;
				} catch (error: any) {
					toast.warn("bad network try again");
					throw { logout: false };
				}
			},
			{
				populateCache(result, _) {
					return result;
				},
				revalidate: false,
			}
		);
	}

	async function onIdentify() {
		try {
			const { data } = await HTTPService.get("account");
			return data;
		} catch (error: any) {
			toast.warn("bad connection");
		}
	}

	// TODO on change
	async function onRegister(body: iUserCreate) {
		try {
			const { data }: { data: apiResponse<any> } = await HTTPService.post("account", body);
			if (data.resState === responseState.notValid) return data.warnings.map((warn) => toast.warn(warn.message));
			if (data.resState === responseState.error) return toast.warn(data.error);
			if (data.resState === responseState.ok) return router.push("/profile/welcome");
		} catch (error: any) {
			toast.warn("bad network try again");
		}
	}

	function onLogin({ email, password }: iUserLogin) {
		mutateHandler(() => HTTPService.put("account", { email, password }));
	}

	function onLogout() {
		mutateHandler(() => HTTPService.delete("account"));
	}

	async function onActiveUser({ token }: any) {
		try {
			const { data }: { data: apiResponse<any> } = await HTTPService.patch("account", { token });
			if (data.resState === responseState.notValid) return data.warnings.map((warn) => toast.warn(warn.message));
			if (data.resState === responseState.error) return toast.warn(data.error);
			if (data.resState === responseState.ok) {
				mutate(() => data, {
					populateCache(result, _) {
						return result;
					},
					revalidate: false,
				});
				router.push("/");
				toast.success("congratulation your account is active");
			}
		} catch (error: any) {
			toast.warn("bad network try again");
		}
	}

	function checkHasAccessAndDo(permissionLevel = 0) {
		if (!isLoading && !userInfo?.data) return router.push("/login");
		if (userInfo?.data?.permissionLevel < permissionLevel) return router.push("/403");
	}

	function hasAccess(requirePermissionLevel: number) {
		const hasAccess = userInfo?.data?.permissionLevel < requirePermissionLevel ? false : true;
		return hasAccess;
	}

	async function onUpdateUser(body: iUserUpdate) {
		const { data } = await HTTPService.put(`account/${userInfo.id}`, body);
		if (data.resState === responseState.ok) {
			mutate(() => data, {
				populateCache(result, _) {
					return result;
				},
				revalidate: false,
			});
		}
		return data as apiResponse<any>;
	}

	async function onUpdatePassword(body: iPasswordUpdate) {
		const { data } = await HTTPService.patch(`account/${userInfo.id}`, body);
		return data as apiResponse<any>;
	}

	async function onResendActivationEmail(body: iUserEmail) {
		try {
			const { data }: { data: apiResponse<any> } = await HTTPService.patch("account/recover", body);
			if (data.resState === responseState.notValid) return data.warnings.map((warn) => toast.warn(warn.message));
			if (data.resState === responseState.error) return toast.warn(data.error);
			if (data.resState === responseState.ok) {
				router.push("/");
				toast.success(data.data);
			}
		} catch (error: any) {
			toast.warn("bad network try again");
		}
	}

	async function onRecoverPasswordRequest(body: iUserEmail) {
		try {
			const { data }: { data: apiResponse<any> } = await HTTPService.post("account/recover", body);
			if (data.resState === responseState.notValid) return data.warnings.map((warn) => toast.warn(warn.message));
			if (data.resState === responseState.error) return toast.warn(data.error);
			if (data.resState === responseState.ok) {
				router.push("/");
				toast.success(data.data);
			}
		} catch (error: any) {
			toast.warn("bad network try again");
		}
	}

	async function onResetPassword(args: iResetPassword) {
		try {
			const body = { ...args, token: router.query.token };
			const { data }: { data: apiResponse<any> } = await HTTPService.put("account/recover", body);
			if (data.resState === responseState.notValid) return data.warnings.map((warn) => toast.warn(warn.message));
			if (data.resState === responseState.error) return toast.warn(data.error);
			if (data.resState === responseState.ok) {
				router.push("/login");
				toast.success(data.data);
			}
		} catch (error: any) {
			toast.warn("bad network try again");
		}
	}

	async function onRequestChangeEmail(body: iUserLogin) {
		try {
			const { data }: { data: apiResponse<any> } = await HTTPService.post("account/email", body);
			if (data.resState === responseState.notValid) return data.warnings.map((warn) => toast.warn(warn.message));
			if (data.resState === responseState.error) return toast.warn(data.error);
			if (data.resState === responseState.ok) {
				router.push("/profile/change-request-send");
				toast.success(data.data);
			}
		} catch (error: any) {
			toast.warn("bad network try again");
		}
	}

	async function onValidateChangeEmail({ token }: any) {
		try {
			const { data }: { data: apiResponse<any> } = await HTTPService.patch("account/email", { token });
			if (data.resState === responseState.notValid) return data.warnings.map((warn) => toast.warn(warn.message));
			if (data.resState === responseState.error) return toast.warn(data.error);
			if (data.resState === responseState.ok) {
				mutate(() => data, {
					populateCache(result, _) {
						return result;
					},
					revalidate: false,
				});
				router.push("/");
				toast.success("your account email is changed");
			}
		} catch (error: any) {
			toast.warn("bad network try again");
		}
	}

	async function onSendOTP(body: iPhone) {
		try {
			const { data }: { data: apiResponse<any> } = await HTTPService.post("account/phone", body);
			if (data.resState === responseState.notValid) return data.warnings.map((warn) => toast.warn(warn.message));
			if (data.resState === responseState.error) return toast.warn(data.error);
			if (data.resState === responseState.ok) {
				router.push("/profile/check-otp");
				toast.success(data.data);
			}
		} catch (error: any) {
			toast.warn("bad network try again");
		}
	}

	async function onCheckOTP(otp: any) {
		try {
			const { data }: { data: apiResponse<any> } = await HTTPService.patch("account/phone", { otp });
			if (data.resState === responseState.notValid) return data.warnings.map((warn) => toast.warn(warn.message));
			if (data.resState === responseState.error) return toast.warn(data.error);
			if (data.resState === responseState.ok) {
				mutate(() => data, {
					populateCache(result, _) {
						return result;
					},
					revalidate: false,
				});
				router.push("/");
				toast.success("your phone number updated");
			}
		} catch (error: any) {
			toast.warn("bad network try again");
		}
	}

	return {
		onLogin,
		onLogout,
		onRegister,
		onActiveUser,
		checkHasAccessAndDo,
		hasAccess,
		onImageChange,
		onUpdateUser,
		onUpdatePassword,
		onResendActivationEmail,
		onRecoverPasswordRequest,
		onResetPassword,
		onRequestChangeEmail,
		onValidateChangeEmail,
		onSendOTP,
		onCheckOTP,
		imgParam,
		userInfo: userInfo?.data ? nullPurger(userInfo.data) : false,
		isLoading: isLoading,
		isLoggedIn: userInfo?.data,
		permissionLevel: userInfo?.data?.permissionLevel || 0,
		// TODO check
		errors: userInfo?.error || error,
		warnings: userInfo?.warnings,
	};
}
