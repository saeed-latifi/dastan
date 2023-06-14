import { useImage } from "@hooks/useImage";
import { bucketUrl } from "statics/keys";

export enum logoImageTypes {
	full,
	thumb,
}
export default function TeamLogo({ image, logoType = logoImageTypes.thumb }: { image: string | null; logoType?: logoImageTypes }) {
	const { forceImageParam, isLoading } = useImage();
	const src = image ? `${bucketUrl}/team/${image}?v=${forceImageParam}` : "/images/team.svg";

	if (isLoading)
		return (
			<img
				className="aspect-video overflow-hidden border rounded-theme-border border-theme-border object-cover w-full"
				src="/images/team.svg"
				alt=""
			/>
		);

	return (
		<img
			className={`
			aspect-square overflow-hidden border rounded-theme-border  border-theme-border object-cover ${logoType === logoImageTypes.full ? "w-full  " : "w-12 "} `}
			src={src}
			alt=""
		/>
	);
}
