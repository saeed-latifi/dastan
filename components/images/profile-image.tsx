import { useImage } from "@hooks/useImage";
import { bucketUrl } from "statics/keys";

export default function ProfileImage({ slug }: { slug: string }) {
	const { forceImageParam } = useImage();
	const src = `${bucketUrl}/profile/${slug}.webp?v=${forceImageParam}`;

	return (
		<img
			className="w-8 aspect-square rounded-full overflow-hidden border border-gray-600 object-cover"
			src={src}
			onError={(e: any) => (e?.target?.src?.includes(src) ? (e.target.src = "/images/profile.svg") : "")}
			alt=""
			key={forceImageParam}
		/>
	);
}
