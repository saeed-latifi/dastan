import Link from "next/link";
import ArrowIcon from "./icons/arrow-icon";

type navigationProps = { label: string; path: string };
export default function Navigation({ label, path }: navigationProps) {
	return (
		<div className=" w-full flex items-center justify-between p-2 g-4 border-b border-theme-border ">
			<Link href={path} className="px-1 hover:px-0">
				<ArrowIcon width="1rem" />
			</Link>
			<span>{label}</span>
		</div>
	);
}
