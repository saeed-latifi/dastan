import HTTPService from "@providers/HTTPService";
import { apiResponse, responseState } from "@providers/apiResponseHandler";
import { toast } from "react-toastify";
import useSWR from "swr";
import { useRouter } from "next/router";
import { fetchHandler } from "./useFetch";
import { staticClientURL } from "statics/url";
import { iCourseUpdate } from "@models/iCourse";

export function useCourse() {
	const router = useRouter();

	const {
		data: coursesInfo,
		mutate: coursesMutate,
		isLoading,
	} = useSWR("userCourses", getCourses, {
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
	});

	async function getCourses() {
		try {
			const { data }: { data: apiResponse<any[]> } = await HTTPService.get("course");
			if (data.resState === responseState.ok) return data.data;
		} catch (error: any) {
			toast.warn("bad connection");
		}
	}

	function onAddCourse(body: { title: string; description: string; categoryId: number }) {
		fetchHandler({
			fetcher: () => HTTPService.post("course", body),
			onOK: (res) => {
				// coursesMutate(res.data, {
				// 	populateCache(result, baseState) {
				// 		const mutated = produce(baseState, (draft) => {
				// 			if (Array.isArray(draft)) draft.push(result);
				// 			else draft = [result];
				// 		});
				// 		return mutated;
				// 	},
				// 	revalidate: false,
				// });
				router.push(staticClientURL.panel.course.all);
			},
		});
	}

	function onUpdateCourse(body: iCourseUpdate) {
		fetchHandler({
			fetcher: () => HTTPService.put("course", body),
			onOK: (res) => {
				// coursesMutate(res.data, {
				// 	populateCache(result, baseState) {
				// 		const mutated = produce(baseState, (draft) => {
				// 			if (Array.isArray(draft)) draft.push(result);
				// 			else draft = [result];
				// 		});
				// 		return mutated;
				// 	},
				// 	revalidate: false,
				// });
				router.push(staticClientURL.panel.course.all);
			},
		});
	}

	return { isLoading, coursesInfo, onAddCourse, onUpdateCourse };
}
