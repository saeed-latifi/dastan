import { adminTicketType } from "@providers/prismaProviders/ticketPrisma";
import { useRouter } from "next/router";
import { staticURLs } from "statics/url";

export default function AdminTicketCard({ ticket }: { ticket: adminTicketType }) {
	const router = useRouter();
	return (
		<div className="flex items-center justify-between border  border-theme-border rounded-theme-border p-2">
			<p
				className="cursor-pointer select-none hover:text-theme-border active:opacity-80"
				onClick={() => router.push(staticURLs.client.admin.tickets.one({ ticketId: ticket.id }))}
			>
				{ticket.title}
			</p>
			<p className="select-none">{ticket.user.username}</p>
		</div>
	);
}
