import { z } from "zod";

const title = z.string();
const description = z.string();
const id = z.number();
const ticketId = z.number();
const userId = z.number().optional();
const isActive = z.boolean().optional();

// schema
export const zCreateTicket = z.object({ title, description });
export const zAddMessageTicket = z.object({ ticketId, description });
export const zAdminTickets = z.object({ userId, isActive });
export const zAdminUsers = z.object({ isActive });

// types
export type iCreateTicket = z.infer<typeof zCreateTicket>;
export type iAddMessageTicket = z.infer<typeof zAddMessageTicket>;
export type iAdminTickets = z.infer<typeof zAdminTickets>;
export type iAdminUsers = z.infer<typeof zAdminUsers>;
