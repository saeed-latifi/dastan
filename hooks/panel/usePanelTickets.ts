import { iPagination } from "@models/iPagination";
import { iCreateTicket } from "@models/iTicket";
import HTTPService, { takeNumber } from "@providers/HTTPService";
import { apiResponse, resWithPaginationType, responseState } from "@providers/apiResponseHandler";
import { ticketResType } from "@providers/prismaProviders/ticketPrisma";
import { toast } from "react-toastify";
import { staticURLs } from "statics/url";
import useSWR from "swr";

export function usePanelTickets() {
	const {
		data: ticketsInfo,
		mutate,
		isLoading,
		isValidating,
	} = useSWR("panelTickets", getTickets, { revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false });

	async function getTickets() {
		try {
			const body: iPagination = { skip: 0, take: takeNumber };
			const { data }: { data: apiResponse<resWithPaginationType<ticketResType>> } = await HTTPService.patch(staticURLs.server.panel.tickets.base, body);
			if (data.resState === responseState.ok) return data.data;
		} catch (error: any) {
			toast.warn("bad connection");
		}
	}

	async function getMore() {
		try {
			const body: iPagination = { skip: ticketsInfo?.items.length || 0, take: takeNumber };
			const { data }: { data: apiResponse<resWithPaginationType<ticketResType>> } = await HTTPService.patch(staticURLs.server.panel.tickets.base, body);
			if (data.resState === responseState.ok) {
				mutate(undefined, {
					populateCache(_result, _currentData) {
						const newObject: resWithPaginationType<ticketResType> = { count: data.data.count, items: [] };
						ticketsInfo?.items.forEach((item) => newObject.items.push(item));
						data.data.items.forEach((item) => newObject.items.push(item));
						return newObject;
					},
					revalidate: false,
				});
				return data.data;
			}
		} catch (error: any) {
			toast.warn("bad connection");
		}
	}

	async function createTicket(body: iCreateTicket) {
		try {
			const { data }: { data: apiResponse<ticketResType> } = await HTTPService.post(staticURLs.server.panel.tickets.base, body);
			if (data.resState === responseState.ok) {
				mutate(undefined, {
					populateCache(_result, _currentData) {
						const newArray = [];
						newArray.push(data.data);
						ticketsInfo?.items.forEach((t) => newArray.push(t));
						return { count: ticketsInfo ? ticketsInfo.count + 1 : 0, items: newArray };
					},
					revalidate: false,
				});
				return data.data;
			} else {
				const errors = Object.entries(data.errors);
				toast.warn(errors[0][1]);
			}
		} catch (error: any) {
			toast.warn("bad connection");
		}
	}

	async function closeTicket(ticketId: number) {
		try {
			const { data }: { data: apiResponse<ticketResType | null> } = await HTTPService.delete(staticURLs.server.panel.tickets.base, {
				params: { ticketId },
			});
			if (data.resState === responseState.ok) {
				mutate(undefined, {
					populateCache(_result, _currentData) {
						const newObject: resWithPaginationType<ticketResType> = {
							count: ticketsInfo ? ticketsInfo.count - 1 : 0,
							items: ticketsInfo ? ticketsInfo.items.filter((item) => item.id !== ticketId) : [],
						};

						return newObject;
					},
					revalidate: false,
				});
				return data.data;
			}
		} catch (error: any) {
			toast.warn("bad connection");
		}
	}

	function hasMore(): boolean {
		if (!ticketsInfo) return false;
		return ticketsInfo.items.length < ticketsInfo.count;
	}

	return { ticketsInfo, isLoading, isValidating, hasMore: hasMore(), getMore, createTicket, closeTicket };
}
