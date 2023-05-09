import { useImage } from "@hooks/useImage";

export default function ProfileImage({ slug }: { slug: string }) {
	const { forceImageParam } = useImage();
	const src = `/images/profile/${slug}/${forceImageParam}.webp`;

	return (
		<img
			className="w-8 aspect-square rounded-full overflow-hidden border border-gray-600 object-cover"
			src={src}
			onError={(e: any) => (e?.target?.src?.includes(src) ? (e.target.src = "/images/profile.svg") : "")}
			alt=""
		/>
	);
}
