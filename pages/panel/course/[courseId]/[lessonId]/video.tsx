import Navigation from "@components/navigation";
import { staticURLs } from "statics/url";
import { useRouter } from "next/router";
import LoadingSpinner from "@components/common/loader-spinner";

export default function LessonVideo() {
	const router = useRouter();
	if (!router.isReady) return <LoadingSpinner />;

	const { lessonId, courseId } = router.query as { lessonId: string; courseId: string };
	console.log({ lessonId });

	return (
		<div className="flex flex-col w-full gap-2 items-center max-w-2xl">
			<Navigation label="" path={staticURLs.client.panel.course.one({ courseId: parseInt(courseId) })} />
			<video src={`/api/test?videoId=${lessonId}`} width="800px" height="auto" controls autoPlay id="video-player" />
		</div>
	);
}
