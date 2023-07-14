import React from "react";

export default function ContextCard({ context }: { context: string }) {
	return <div className="ql-editor border border-theme-border rounded-theme-border w-full p-2" dangerouslySetInnerHTML={{ __html: context }}></div>;
}
