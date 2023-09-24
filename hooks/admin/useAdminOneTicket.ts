// import { iCreateAdminTicket, iUpdateAdminTicket } from "@models/iAdminTicket";
import { iAddMessageTicket, iUpdateTicketMessage } from "@models/iTicket";
import HTTPService from "@providers/HTTPService";
import { apiResponse, responseState } from "@providers/apiResponseHandler";
import { adminOneTicketType, ticketMessageType } from "@providers/prismaProviders/ticketPrisma";
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
			const { data }: { data: apiResponse<adminOneTicketType> } = await HTTPService.get(staticURLs.server.admin.tickets.base, { params: { ticketId } });
			if (data.resState === responseState.ok) return data.data;
			else toast.warn(data.errors[0]);
		} catch (error: any) {
			toast.warn("bad connection");
		}
	}

	async function addAnswer(body: iAddMessageTicket) {
		if (!ticketInfo) return;
		try {
			const { data }: { data: apiResponse<ticketMessageType> } = await HTTPService.post(staticURLs.server.admin.tickets.base, body);

			if (data.resState === responseState.ok) {
				toast.success("answer added");
				mutate(undefined, {
					populateCache(_result, _baseState) {
						const ticketClone = { ...ticketInfo };
						const ticketMessagesClone = [...ticketInfo?.messages];
						ticketMessagesClone.unshift(data.data);
						ticketClone.messages = ticketMessagesClone;
						return ticketClone;
					},
					revalidate: false,
				});
				return data.data;
			} else {
				// TODO extract on error log
				const errors = Object.entries(data.errors);
				toast.warn(errors[0][1]);
			}
		} catch (error: any) {
			toast.warn("bad connection");
		}
	}

	async function updateAnswer(body: iUpdateTicketMessage) {
		if (!ticketInfo) return;
		try {
			const { data }: { data: apiResponse<ticketMessageType> } = await HTTPService.patch(staticURLs.server.admin.tickets.base, body);

			if (data.resState === responseState.ok) {
				toast.success("answer updated");
				mutate(undefined, {
					populateCache(_result, _baseState) {
						const ticketClone = { ...ticketInfo };
						const ticketMessagesClone = ticketInfo.messages.map((message) => {
							if (message.id === data.data.id) return data.data;
							else return message;
						});
						ticketClone.messages = ticketMessagesClone;
						return ticketClone;
					},
					revalidate: false,
				});
				return data.data;
			} else {
				// TODO extract on error log
				const errors = Object.entries(data.errors);
				toast.warn(errors[0][1]);
			}
		} catch (error: any) {
			toast.warn("bad connection");
		}
	}

	return {
		addAnswer,
		updateAnswer,
		isLoading: isLoading,
		isValidating,
		ticket: ticketInfo,
	};
}
