import { iProvince } from "@models/iProvince";
import HTTPService from "@providers/HTTPService";
import { apiResponse, responseState } from "@providers/apiResponseHandler";
import { staticURLs } from "statics/url";
import useSWR from "swr";

export function useProvince() {
	const { data: provinces } = useSWR("provinces", getProvinces, {
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
	});

	async function getProvinces() {
		try {
			const { data }: { data: apiResponse<iProvince[]> } = await HTTPService.get(staticURLs.server.public.province.base);
			if (data.resState === responseState.ok) {
				return data.data as iProvince[];
			}
		} catch (error: any) {
			throw error;
		}
	}

	return { provinces };
}
