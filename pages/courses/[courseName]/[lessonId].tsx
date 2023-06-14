import Navigation from "@components/navigation";
import { staticURLs } from "statics/url";
import { useRouter } from "next/router";
import LoadingSpinner from "@components/common/loader-spinner";

export default function LessonVideo() {
	const router = useRouter();
	if (!router.isReady) return <LoadingSpinner />;

	const { courseName, lessonId } = router.query as { courseName: string; lessonId: string };
	console.log({ lessonId });

	return (
		<div>
			<Navigation label="" path={staticURLs.client.feed.course({ courseName })} />
			<video src={`/api/test?videoId=${lessonId}`} width="800px" height="auto" controls autoPlay id="video-player" />
		</div>
	);
}
