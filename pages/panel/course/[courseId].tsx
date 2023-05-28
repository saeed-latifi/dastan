import FormInput from "@components/forms/form-input";
import Form from "@components/forms/form";
import ButtonBase, { BaseButtonVariety } from "@components/common/base-button";
import { FormEvent, useEffect, useState } from "react";
import FormSection from "@components/forms/form-section";
import { useRouter } from "next/router";
import LoaderSpinner from "@components/common/loader-spinner";
import Navigation from "@components/navigation";
import { zKeyword, zKeywords } from "@models/iKeyword";
import { toast } from "react-toastify";
import FormItemRow from "@components/forms/form-item-row";
import { zAttachment, zAttachments } from "@models/iAttachment";
import { emptyPurger } from "@utilities/nullPurger";
import { zLessonCreate, zLessonUpdate } from "@models/iLesson";
import { errorType, zodErrorMapper } from "@providers/apiResponseHandler";
import TextArea from "@components/forms/form-text-area";
import { staticURLs } from "statics/url";
import { useCourse } from "@hooks/panel/useCourse";

export default function Jobs() {
	const router = useRouter();
	const [lesson, setLesson] = useState<any>();
	const { coursesInfo, isLoading, onUpdateLesson, onAddLesson } = useCourse();

	const [title, setTitle] = useState<string>();
	const [description, setDescription] = useState<string>();
	const [videoUrl, setVideoUrl] = useState<string>("");
	const [attachments, setAttachments] = useState<string[]>([]);
	const [keywords, setKeywords] = useState<string[]>([]);

	const [keyword, setKeyword] = useState<string>("");
	const [attachment, setAttachment] = useState<string>("");
	const [errors, setErrors] = useState<errorType>();

	useEffect(() => {
		if (router.isReady) {
			const course = coursesInfo?.find((item) => item.id === parseInt(router.query.courseId as string));
			if (course) {
				const item = course.lesson?.find((item: any) => item.id === parseInt(router.query.item as string));
				if (item) {
					setLesson(item);
					setTitle(item.title);
					setDescription(item.description);
					setAttachments(item.attachments);
					setVideoUrl(item.videoUrl);
					if (item?.content?.keyword && Array.isArray(item.content.keyword)) {
						setKeywords(item.content.keyword.map((item: any) => item.title));
					}
				}
			}
		}
	}, [router, coursesInfo]);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (router.query.courseId) {
			const body = {
				title,
				description,
				attachments,
				keywords,
				videoUrl,
				courseId: parseInt(router.query.courseId as string),
			};
			const purged = emptyPurger(body);
			if (lesson) {
				purged.contentId = lesson.contentId;
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

	const addKeyword = () => {
		if (keyword) {
			const key = zKeyword.safeParse(keyword);
			if (!key.success) return toast.warn(key.error.issues[0].message);
			const newArr = [...keywords, keyword];
			const validate = zKeywords.safeParse(newArr);
			if (!validate.success) return toast.warn(validate.error.issues[0].message);
			setKeywords(newArr);
			setKeyword("");
		}
	};

	const removeKeyword = (index: number) => {
		const newArr = keywords.filter((_, i) => index !== i);
		setKeywords(newArr);
	};

	const addAttachment = () => {
		if (attachment) {
			const item = zAttachment.safeParse(attachment);
			if (!item.success) return toast.warn(item.error.issues[0].message);
			const newArr = [...attachments, attachment];
			const validate = zAttachments.safeParse(newArr);
			if (!validate.success) return toast.warn(validate.error.issues[0].message);
			setAttachments(newArr);
			setAttachment("");
		}
	};

	const removeAttachment = (index: number) => {
		const newArr = attachments.filter((_, i) => index !== i);
		setAttachments(newArr);
	};

	if (isLoading || !router.isReady) return <LoaderSpinner />;
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
			<FormSection title="description">
				<TextArea value={description} onChange={(e) => setDescription(e.target.value)} warnings={errors?.description} />
			</FormSection>

			<FormSection title="video link">
				<FormInput value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} warnings={errors?.videoUrl} />
			</FormSection>

			<FormSection title="keywords">
				<FormInput value={keyword} onChange={(e) => setKeyword(e.target.value)} />
				<ButtonBase Variety={BaseButtonVariety.form} type="button" onClick={addKeyword}>
					add new keyword
				</ButtonBase>
				{keywords.map((title, index) => (
					<FormItemRow key={index} index={index} title={title} onClick={removeKeyword} />
				))}
			</FormSection>

			<FormSection title="attachments">
				<FormInput value={attachment} onChange={(e) => setAttachment(e.target.value)} />
				<ButtonBase Variety={BaseButtonVariety.form} type="button" onClick={addAttachment}>
					add new attachment
				</ButtonBase>
				{attachments.map((title, index) => (
					<FormItemRow key={index} index={index} title={title} onClick={removeAttachment} />
				))}
			</FormSection>

			<ButtonBase Variety={BaseButtonVariety.form} type="submit">
				{lesson ? "update" : "create"}
			</ButtonBase>
		</Form>
	);
}
