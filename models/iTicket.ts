import { z } from "zod";

const title = z.string().min(3, "title must be 3 character at least");
const description = z.string();
const id = z.number();
const ticketId = z.number();
const messageId = z.number();
const userId = z.number().optional();
const isActive = z.boolean().optional();

// schema
export const zCreateTicket = z.object({ title, description });
export const zAddMessageTicket = z.object({ ticketId, description });
export const zUpdateTicketMessage = z.object({ messageId, description });
export const zAdminTickets = z.object({ userId, isActive });
export const zAdminOneTicket = z.object({ ticketId });
export const zAdminUsers = z.object({ isActive });

// types
export type iCreateTicket = z.infer<typeof zCreateTicket>;
export type iAddMessageTicket = z.infer<typeof zAddMessageTicket>;
export type iUpdateTicketMessage = z.infer<typeof zUpdateTicketMessage>;
export type iAdminTickets = z.infer<typeof zAdminTickets>;
export type iAdminUsers = z.infer<typeof zAdminUsers>;
