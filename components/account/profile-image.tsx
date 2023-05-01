import { useProfileImageParam } from "@hooks/useProfileImageParam";

export default function ProfileImage({ slug }: { slug: string }) {
	const { profileImageParam } = useProfileImageParam();
	const src = `/images/profile/${slug}/${profileImageParam}.webp`;

	return (
		<img
			className="w-8 aspect-square rounded-full overflow-hidden border border-gray-600"
			src={src}
			onError={(e: any) => (e?.target?.src?.includes(src) ? (e.target.src = "/images/profile.svg") : "")}
			alt=""
		/>
	);
}
