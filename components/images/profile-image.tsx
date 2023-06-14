import { useImage } from "@hooks/useImage";
import { bucketUrl } from "statics/keys";

export default function ProfileImage({ image }: { image: string | null }) {
	const { forceImageParam, isLoading } = useImage();
	const src = image ? `${bucketUrl}/profile/${image}?v=${forceImageParam}` : "/images/profile.svg";

	if (isLoading)
		return (
			<img
				className="w-8 aspect-square rounded-full overflow-hidden border border-gray-600 object-cover"
				src={"/images/profile.svg"}
				alt=""
				key={forceImageParam}
			/>
		);

	return (
		<img
			className="w-8 aspect-square rounded-full overflow-hidden border border-gray-600 object-cover"
			src={src}
			// onError={(e: any) => (e?.target?.src?.includes(src) ? (e.target.src = "/images/profile.svg") : "")}
			alt=""
			key={forceImageParam}
		/>
	);
}
