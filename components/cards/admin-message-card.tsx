import { AdminMessagesResType } from "@providers/prismaProviders/adminMessagePrisma";
import React from "react";

export default function AdminMessageCard({ message }: { message: AdminMessagesResType }) {
	return (
		<div className="flex items-center justify-between border  border-theme-border rounded-theme-border p-2">
			<p>{message.title}</p>
			<p>{message.user.username}</p>
		</div>
	);
}
