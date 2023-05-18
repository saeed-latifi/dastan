import HTTPService from "@providers/HTTPService";
import { apiResponse, responseState } from "@providers/apiResponseHandler";
import { toast } from "react-toastify";
import useSWR from "swr";
import { useRouter } from "next/router";
import { fetchHandler } from "./useFetch";
import { iCourseCreate, iCourseUpdate } from "@models/iCourse";
import { produce } from "immer";
import { iLessonCreate, iLessonUpdate } from "@models/iLesson";
import { staticURLs } from "statics/url";

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
			const { data }: { data: apiResponse<any[]> } = await HTTPService.get("panel/course");
			if (data.resState === responseState.ok) return data.data;
		} catch (error: any) {
			console.log("course Error", error);

			toast.warn("bad connection");
		}
	}

	function onAddCourse(body: iCourseCreate) {
		fetchHandler({
			fetcher: () => HTTPService.post("panel/course", body),
			onOK: (res) => {
				coursesMutate(res.data, {
					populateCache(result, baseState) {
						const mutated = produce(baseState, (draft) => {
							if (Array.isArray(draft)) draft.push(result);
							else draft = [result];
						});
						return mutated;
					},
					revalidate: false,
				});
				router.push(staticURLs.client.panel.course.all);
			},
		});
	}

	function onUpdateCourse(body: iCourseUpdate) {
		fetchHandler({
			fetcher: () => HTTPService.put("panel/course", body),
			onOK: (res) => {
				coursesMutate(res.data, {
					populateCache(result, baseState) {
						const mutated = produce(baseState, (draft) => {
							draft?.forEach((item, index) => {
								if (item.id === result.id) draft[index] = { ...result };
							});
						});
						return mutated;
					},
					revalidate: false,
				});
				router.push(staticURLs.client.panel.course.all);
			},
		});
	}

	function onAddLesson(body: iLessonCreate) {
		fetchHandler({
			fetcher: () => HTTPService.post("panel/lesson", body),
			onOK: (res) => {
				let pageId = 0;
				coursesMutate(res.data, {
					populateCache(result, baseState) {
						const mutated = produce(baseState, (draft) => {
							draft?.forEach((course) => {
								if (course.id === result.courseId) {
									pageId = result.courseId;
									if (Array.isArray(course.lesson)) course.lesson.push(result);
									else course.lesson = [result];
								}
							});
						});
						return mutated;
					},
					revalidate: false,
				});
				router.push(staticURLs.client.panel.course.update({ courseId: pageId }));
			},
		});
	}

	function onUpdateLesson(body: iLessonUpdate) {
		fetchHandler({
			fetcher: () => HTTPService.put("panel/lesson", body),
			onOK: (res) => {
				let pageId = 0;
				coursesMutate(res.data, {
					populateCache(result, baseState) {
						const mutated = produce(baseState, (draft) => {
							draft?.forEach((course) => {
								if (course.id === result.courseId) {
									if (Array.isArray(course.lesson)) {
										course.lesson.forEach((lesson: any, index: number) => {
											if (lesson.id === result.id) {
												pageId = result.courseId;
												course.lesson[index] = { ...result };
											}
										});
									}
								}
							});
						});
						return mutated;
					},
					revalidate: false,
				});
				router.push(staticURLs.client.panel.course.update({ courseId: pageId }));
			},
		});
	}

	return { isLoading, coursesInfo, onAddCourse, onUpdateCourse, onAddLesson, onUpdateLesson };
}
