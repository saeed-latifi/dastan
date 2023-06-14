import FormInput from "@components/forms/form-input";
import Form from "@components/forms/form";
import ButtonBase, { BaseButtonVariety } from "@components/common/base-button";
import { FormEvent, useEffect, useState } from "react";
import FormSection from "@components/forms/form-section";
import { useRouter } from "next/router";
import LoadingSpinner from "@components/common/loader-spinner";
import Navigation from "@components/navigation";
import { emptyPurger } from "@utilities/nullPurger";
import { zLessonCreate, zLessonUpdate } from "@models/iLesson";
import { errorType, zodErrorMapper } from "@providers/apiResponseHandler";
import { staticURLs } from "statics/url";
import { useCoursePanel } from "@hooks/panel/useCoursePanel";
import { lessonResType } from "@providers/prismaProviders/lessonPrisma";
import Link from "next/link";

export default function Jobs() {
	const router = useRouter();
	const [lesson, setLesson] = useState<lessonResType | undefined>();
	const { coursesInfo, isLoading, onUpdateLesson, onAddLesson } = useCoursePanel();

	const [title, setTitle] = useState<string>();
	const [videoUrl, setVideoUrl] = useState<string>("");

	const [errors, setErrors] = useState<errorType>();

	useEffect(() => {
		if (router.isReady) {
			const course = coursesInfo?.find((item) => item.id === parseInt(router.query.courseId as string));
			if (course) {
				const item = course.lessons?.find((item: any) => item.id === parseInt(router.query.item as string));
				if (item) {
					setLesson(item);
					setTitle(item.title);
					setVideoUrl(item.videoUrl || "");
				}
			}
		}
	}, [router, coursesInfo]);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (router.query.courseId) {
			const body = {
				title,
				courseId: parseInt(router.query.courseId as string),
			};
			const purged = emptyPurger(body);
			if (lesson) {
				purged.id = lesson.id;
				const validJob = zLessonUpdate.safeParse(purged);
				if (!validJob.success) {
					console.log(zodErrorMapper(validJob.error.issues));
					return setErrors(zodErrorMapper(validJob.error.issues));
				} else {
					await onUpdateLesson({ ...validJob.data });
					setErrors({});
				}
			} else {
				const validJob = zLessonCreate.safeParse(purged);
				if (!validJob.success) {
					console.log(zodErrorMapper(validJob.error.issues));
					return setErrors(zodErrorMapper(validJob.error.issues));
				} else {
					await onAddLesson(validJob.data);
					setErrors({});
				}
			}
		}
	}

	if (isLoading || !router.isReady) return <LoadingSpinner />;
	if (router.query.item && !lesson) {
		return (
			<div className="flex flex-col items-center gap-4">
				<p>bad address</p>
				<ButtonBase type="button" onClick={() => router.push(staticURLs.client.panel.course.all)}>
					back to your courses list
				</ButtonBase>
			</div>
		);
	}

	return (
		<Form onSubmit={handleSubmit}>
			<Navigation label="" path={staticURLs.client.panel.course.one({ courseId: parseInt(router.query.courseId as string) })} />
			<FormSection title="title">
				<FormInput value={title} onChange={(e) => setTitle(e.target.value)} warnings={errors?.title} />
			</FormSection>

			{lesson && (
				<FormSection title="video">
					<p>{videoUrl}</p>

					<Link href={staticURLs.client.panel.course.lesson.addVideo({ lessonId: lesson.id, courseId: lesson.courseId })}>
						add video
					</Link>
				</FormSection>
			)}

			<ButtonBase Variety={BaseButtonVariety.form} type="submit">
				{lesson ? "update" : "create"}
			</ButtonBase>
		</Form>
	);
}
