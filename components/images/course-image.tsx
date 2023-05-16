import { useImage } from "@hooks/useImage";
import { bucketUrl } from "statics/keys";

export default function CourseImage({ id }: { id: string }) {
	const { forceImageParam } = useImage();
	const src = `${bucketUrl}/course/${id}.webp?v=${forceImageParam}`;

	return (
		<img
			className="aspect-video overflow-hidden border rounded-theme-border border-theme-border object-cover w-full"
			src={src}
			onError={(e: any) => (e?.target?.src?.includes(src) ? (e.target.src = "/images/team.svg") : "")}
			alt=""
		/>
	);
}
