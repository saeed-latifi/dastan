import { useImage } from "@hooks/useImage";
import { bucketUrl } from "statics/keys";

export default function CourseImage({ image }: { image: string | null }) {
	const { forceImageParam, isLoading } = useImage();
	const src = image ? `${bucketUrl}/course/${image}?v=${forceImageParam}` : "/images/course.svg";

	if (isLoading)
		return (
			<img
				className="aspect-video overflow-hidden border rounded-theme-border border-theme-border object-contain w-full"
				src="/images/course.svg"
				alt=""
			/>
		);

	return <img className="aspect-video overflow-hidden border rounded-theme-border border-theme-border object-cover w-full" src={src} alt="" />;
}
