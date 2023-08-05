import { iAddMessageTicket } from "@models/iTicket";
import HTTPService from "@providers/HTTPService";
import { apiResponse, responseState } from "@providers/apiResponseHandler";
import { ticketMessageType, ticketResType } from "@providers/prismaProviders/ticketPrisma";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { staticURLs } from "statics/url";
import useSWR from "swr";

export function usePanelTicketOne() {
	const router = useRouter();
	const ticketId = parseInt(router.query.ticketId as string);

	const {
		data: ticketInfo,
		mutate,
		isLoading,
		isValidating,
	} = useSWR(keyGenerator(), getTicket, { revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false });

	function keyGenerator() {
		return `${ticketId},panelTicket`;
	}

	async function getTicket(args: string) {
		const ticketId = parseInt(args.split(",")[0]);
		if (!ticketId) return;
		try {
			const { data }: { data: apiResponse<ticketResType | null> } = await HTTPService.get(staticURLs.server.panel.tickets.base, {
				params: { ticketId },
			});
			if (data.resState === responseState.ok) return data.data;
		} catch (error: any) {
			toast.warn("bad connection");
		}
	}

	async function addMessage(description: string) {
		if (!ticketId) return;
		const body: iAddMessageTicket = { ticketId, description };

		try {
			const { data }: { data: apiResponse<ticketMessageType> } = await HTTPService.put(staticURLs.server.panel.tickets.base, body);
			if (data.resState === responseState.ok) {
				mutate(undefined, {
					populateCache(_result, _currentData) {
						if (!data.data || !ticketInfo) return;
						const newObj = { ...ticketInfo };
						newObj.messages.unshift(data.data);
						return newObj;
					},
					revalidate: false,
				});
				return data.data;
			}
		} catch (error: any) {
			toast.warn("bad connection");
		}
	}

	return { ticketInfo, isLoading, isValidating, addMessage };
}
