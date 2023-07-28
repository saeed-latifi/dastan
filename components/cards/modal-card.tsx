import React, { ReactNode } from "react";

export default function CardModal({ children }: { children: ReactNode }) {
	return <div className="bg-theme-white border rounded-theme-border border-theme-border p-2">{children}</div>;
}
