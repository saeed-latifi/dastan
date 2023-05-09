import { useImage } from "@hooks/useImage";
import { bucketUrl } from "statics/keys";

export enum logoImageTypes {
	full,
	thumb,
}
export default function TeamLogo({ id, logoType = logoImageTypes.thumb }: { id: string; logoType?: logoImageTypes }) {
	const { forceImageParam } = useImage();
	const src = `${bucketUrl}/team/${id}.webp?v=${forceImageParam}`;

	return (
		<img
			className={`
			aspect-square overflow-hidden border rounded-theme-border  border-theme-border object-cover ${logoType === logoImageTypes.full ? "w-full  " : "w-12 "} `}
			src={src}
			onError={(e: any) => (e?.target?.src?.includes(src) ? (e.target.src = "/images/team.svg") : "")}
			alt=""
		/>
	);
}
