import { useAccount } from "@hooks/useAccount";

export default function ProfileImage({ slug }: { slug: string }) {
	const { imgParam } = useAccount();
	const src = `/images/profile/${slug}/${imgParam}.webp`;

	return (
		<img
			className="w-8 aspect-square rounded-full overflow-hidden border border-gray-600"
			src={src}
			onError={(e: any) => (e?.target?.src?.includes(src) ? (e.target.src = "/images/profile.svg") : "")}
			alt=""
		/>
	);
}
