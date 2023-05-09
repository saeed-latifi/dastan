import { useImage } from "@hooks/useImage";

export default function TeamLogo({ id }: { id: string }) {
	const { forceImageParam } = useImage();
	const src = `/images/team/${id}/${forceImageParam}.webp`;

	return (
		<img
			className="w-full aspect-square rounded-theme-border overflow-hidden border border-theme-border object-cover"
			src={src}
			onError={(e: any) => (e?.target?.src?.includes(src) ? (e.target.src = "/images/team.svg") : "")}
			alt=""
		/>
	);
}
