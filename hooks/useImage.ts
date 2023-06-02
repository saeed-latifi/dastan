import HTTPService from "@providers/HTTPService";
import { responseState } from "@providers/apiResponseHandler";
import { paramGenerator } from "@utilities/paramGenerator";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { staticURLs } from "statics/url";
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
			const { data } = await HTTPService.post(staticURLs.server.account.image, formData);
			if (data.resState === responseState.ok) {
				imgParamMutate(paramGenerator, {
					populateCache(result, _) {
						return result;
					},
					revalidate: false,
				});
				router.push(staticURLs.client.account.base);
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
			const { data } = await HTTPService.post(staticURLs.server.panel.team.image, formData);
			if (data.resState === responseState.ok) {
				imgParamMutate(paramGenerator, {
					populateCache(result, _) {
						return result;
					},
					revalidate: false,
				});
				router.push(staticURLs.client.panel.team.all);
				return toast.success("image uploaded.");
			} else {
				return toast.warn("image upload failed!");
			}
		} catch (error) {
			return toast.warn("image upload failed!");
		}
	}

	async function onUpdateCourseImage({ formData }: { formData: FormData }) {
		try {
			const { data } = await HTTPService.post(staticURLs.server.panel.course.image, formData);
			if (data.resState === responseState.ok) {
				imgParamMutate(paramGenerator, {
					populateCache(result, _) {
						return result;
					},
					revalidate: false,
				});
				router.push(staticURLs.client.panel.course.all);
				return toast.success("image uploaded.");
			} else {
				return toast.warn("image upload failed!");
			}
		} catch (error) {
			return toast.warn("image upload failed!");
		}
	}

	// TODO fix return to number shape
	return { onUpdateProfileImage, onUpdateTeamLogo, onUpdateCourseImage, forceImageParam: forceImageParam?.value };
}
