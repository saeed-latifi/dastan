import HTTPService from "@providers/HTTPService";
import { apiResponse, responseState } from "@providers/apiResponseHandler";
import { toast } from "react-toastify";
import useSWR from "swr";
import { useRouter } from "next/router";
import { iCourseCreate, iCourseUpdate } from "@models/iCourse";
import { produce } from "immer";
import { iLessonCreate, iLessonUpdate } from "@models/iLesson";
import { staticURLs } from "statics/url";
import { fetchHandler } from "@hooks/useFetch";
import { courseImageRes, coursePanelResType } from "@providers/prismaProviders/coursePrisma";
import { lessonResType } from "@providers/prismaProviders/lessonPrisma";
import { useImage } from "@hooks/useImage";

export function useCoursePanel() {
	const router = useRouter();
	const { forceImageParam, onIncrease } = useImage();

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
			const { data }: { data: apiResponse<coursePanelResType[]> } = await HTTPService.get(staticURLs.server.panel.course.base);
			if (data.resState === responseState.ok) return data.data;
		} catch (error: any) {
			toast.warn("bad connection");
		}
	}

	function onAddCourse(body: iCourseCreate) {
		fetchHandler<coursePanelResType>({
			fetcher: () => HTTPService.post(staticURLs.server.panel.course.base, body),
			onOK: (res) => {
				coursesMutate(undefined, {
					populateCache(_result, baseState) {
						const mutated = produce(baseState, (draft) => {
							if (Array.isArray(draft)) draft.push(res);
							else draft = [res];
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
		fetchHandler<coursePanelResType>({
			fetcher: () => HTTPService.put(staticURLs.server.panel.course.base, body),
			onOK: (res) => {
				coursesMutate(undefined, {
					populateCache(_result, baseState) {
						const mutated = produce(baseState, (draft) => {
							draft?.forEach((item, index) => {
								if (item.id === res.id) draft[index] = { ...res };
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
		fetchHandler<lessonResType>({
			fetcher: () => HTTPService.post(staticURLs.server.panel.lesson.base, body),
			onOK: (res) => {
				let pageId = 0;
				coursesMutate(undefined, {
					populateCache(_result, baseState) {
						const mutated = produce(baseState, (draft) => {
							draft?.forEach((course) => {
								if (course.id === res.courseId) {
									pageId = res.courseId;
									if (Array.isArray(course.lessons)) course.lessons.push(res);
									else course.lessons = [res];
								}
							});
						});
						return mutated;
					},
					revalidate: false,
				});
				router.push(staticURLs.client.panel.course.one({ courseId: pageId }));
			},
		});
	}

	function onUpdateLesson(body: iLessonUpdate) {
		fetchHandler<lessonResType>({
			fetcher: () => HTTPService.put(staticURLs.server.panel.lesson.base, body),
			onOK: (res) => {
				let pageId = 0;
				coursesMutate(undefined, {
					populateCache(_result, baseState) {
						const mutated = produce(baseState, (draft) => {
							draft?.forEach((course) => {
								if (course.id === res.courseId) {
									if (Array.isArray(course.lessons)) {
										course.lessons.forEach((lesson: any, index: number) => {
											if (lesson.id === res.id) {
												pageId = res.courseId;
												course.lessons[index] = { ...res };
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
				router.push(staticURLs.client.panel.course.one({ courseId: pageId }));
			},
		});
	}

	async function onUpdateCourseImage({ formData }: { formData: FormData }) {
		try {
			const { data }: { data: apiResponse<courseImageRes> } = await HTTPService.post(staticURLs.server.panel.course.image, formData);
			if (data.resState === responseState.ok) {
				onIncrease();
				coursesMutate(undefined, {
					populateCache(_result, baseState) {
						const mutated = produce(baseState, (draft) => {
							if (draft) {
								draft.forEach((course) => {
									if (course.id === data.data.id) {
										course.content.image = data.data.content.image;
									}
								});
							}
						});
						return mutated;
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

	return { isLoading, coursesInfo, onAddCourse, onUpdateCourse, onAddLesson, onUpdateLesson, onUpdateCourseImage };
}
