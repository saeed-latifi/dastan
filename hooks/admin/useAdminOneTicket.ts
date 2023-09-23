// import { iCreateAdminTicket, iUpdateAdminTicket } from "@models/iAdminTicket";
import HTTPService from "@providers/HTTPService";
import { apiResponse, responseState } from "@providers/apiResponseHandler";
import { adminOneTicketType } from "@providers/prismaProviders/ticketPrisma";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { staticURLs } from "statics/url";
import useSWR from "swr";

export function useAdminOneTicket() {
	const router = useRouter();

	function keyGenerator() {
		const ticketId = parseInt(router.query.ticketId as string);
		if (!ticketId) return "oneTicketNoTicketId!";
		return `oneTicket,${router.query.ticketId}`;
	}

	const options = {
		revalidateFirstPage: false,
		revalidateAll: false,
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
		// revalidateOnMount: false,
	};

	const { data: ticketInfo, isLoading, isValidating, mutate } = useSWR(keyGenerator, getTickets, { ...options });

	async function getTickets(key: string) {
		const ticketId = parseInt(key.split(",")[1]);
		if (!ticketId) return;

		try {
			const { data }: { data: apiResponse<adminOneTicketType> } = await HTTPService.patch(staticURLs.server.admin.tickets.base, { ticketId });
			if (data.resState === responseState.ok) return data.data;
			else toast.warn(data.errors[0]);
		} catch (error: any) {
			toast.warn("bad connection");
		}
	}

	// TODO
	// async function addAnswer() {

	// }

	// TODO
	// async function updateAnswer() {

	// }

	return {
		isLoading: isLoading,
		isValidating,
		ticket: ticketInfo,
	};
}
