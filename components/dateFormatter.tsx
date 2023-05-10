import React from "react";

export default function DateFormatter({ date }: { date: string }) {
	const d = new Date(date).toLocaleDateString("fa-IR", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
	const dateArr = d.split(" ");
	return (
		<p className="flex items-center gap-1 text-sm overflow-hidden">
			<span>{dateArr[2]}</span>
			<span>{dateArr[1]}</span>
			<span>{dateArr[0]}</span>
		</p>
	);
}
