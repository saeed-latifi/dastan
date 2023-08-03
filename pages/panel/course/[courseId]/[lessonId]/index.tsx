import ButtonBase from "@components/common/base-button";
import LoadingSpinner from "@components/animations/LoadingAnimation";
import Form from "@components/forms/form";
import Navigation from "@components/navigation";
import HTTPService from "@providers/HTTPService";
import { AxiosRequestConfig } from "axios";
import { useRouter } from "next/router";
import { FormEvent, useRef, useState } from "react";
import { staticURLs } from "statics/url";

export default function VideoUpload() {
	const router = useRouter();
	const { courseId, lessonId } = router.query as { courseId: string; lessonId: string };

	const [file, setFile] = useState<File | undefined>();
	const [videoSrc, setVideoSrc] = useState<string>();
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState(null);
	const [submitting, setSubmitting] = useState(false);

	const videoEl = useRef<HTMLVideoElement>(null);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const video = videoEl.current;
		if (!file || !video) return;
		const duration = Math.floor(video.duration);
		setSubmitting(true);
		const data = new FormData();
		data.append("video", file);

		const config: AxiosRequestConfig = {
			onUploadProgress: function (progressEvent) {
				const total = progressEvent.total ? progressEvent.total : 100;
				const percentComplete = Math.round((progressEvent.loaded * 100) / total);
				setProgress(percentComplete);
			},
			params: { lessonId, duration },
			timeout: 1000 * 60 * 30,
		};

		try {
			await HTTPService.post(staticURLs.server.panel.lesson.video, data, config);
			// router.push(staticURLs.client.panel.course.lesson.showVideo({ courseId: parseInt(courseId), lessonId: parseInt(lessonId) }));
		} catch (e: any) {
			setError(e.message);
		} finally {
			setSubmitting(false);
			setProgress(0);
		}
	}

	function handleSetFile(event: React.ChangeEvent<HTMLInputElement>) {
		const files = event.target.files;

		if (files?.length) {
			setFile(files[0]);
			setVideoSrc(URL.createObjectURL(files[0]));
		}
	}

	if (!router.isReady) return <LoadingSpinner />;

	return (
		<Form onSubmit={handleSubmit}>
			<Navigation label="" path={staticURLs.client.panel.course.lesson.one({ courseId: parseInt(courseId), lessonId: parseInt(lessonId) })} />

			{error && <p>{error}</p>}
			{submitting && <p>{progress}%</p>}
			<div className="flex flex-col items-center gap-2">
				<label htmlFor="file">File</label>
				<input type="file" id="file" accept=".mp4" onChange={handleSetFile} />
				{videoSrc && <video ref={videoEl} className="" src={videoSrc} controls></video>}
			</div>
			{videoSrc && <ButtonBase>Upload video</ButtonBase>}
		</Form>
	);
}
