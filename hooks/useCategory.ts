import { iCategory } from "@models/iCategory";
import HTTPService from "@providers/HTTPService";
import { apiResponse, responseState } from "@providers/apiResponseHandler";
import useSWR from "swr";

export function useCategory() {
	const { data: categories } = useSWR("categories", getCategories, {
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
	});

	async function getCategories() {
		try {
			const { data }: { data: apiResponse<iCategory[]> } = await HTTPService.get("category");
			if (data.resState === responseState.ok) {
				return data.data as iCategory[];
			}
		} catch (error: any) {
			throw error;
		}
	}

	return { categories };
}
