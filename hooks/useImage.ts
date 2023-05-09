import HTTPService from "@providers/HTTPService";
import { responseState } from "@providers/apiResponseHandler";
import { paramGenerator } from "@utilities/paramGenerator";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import useSWR from "swr";

export function useImage() {
	const router = useRouter();
	const { data: forceImageParam, mutate: imgParamMutate } = useSWR("forceChangeImageParam", paramGenerator, {
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
	});

	async function onUpdateProfileImage({ formData }: { formData: FormData }) {
		try {
			const { data } = await HTTPService.post("/account/image", formData);
			if (data.resState === responseState.ok) {
				imgParamMutate(paramGenerator, {
					populateCache(result, _) {
						return result;
					},
					revalidate: false,
				});
				router.push("/profile");
				return toast.success("image uploaded.");
			} else {
				return toast.warn("image upload failed!");
			}
		} catch (error) {
			return toast.warn("image upload failed!");
		}
	}

	async function onUpdateTeamLogo({ formData }: { formData: FormData }) {
		try {
			const { data } = await HTTPService.post("/team/logo", formData);
			if (data.resState === responseState.ok) {
				imgParamMutate(paramGenerator, {
					populateCache(result, _) {
						return result;
					},
					revalidate: false,
				});
				router.push("/team");
				return toast.success("image uploaded.");
			} else {
				return toast.warn("image upload failed!");
			}
		} catch (error) {
			return toast.warn("image upload failed!");
		}
	}

	return { onUpdateProfileImage, onUpdateTeamLogo, forceImageParam };
}
