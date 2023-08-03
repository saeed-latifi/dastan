import { z } from "zod";

const title = z.string();
const description = z.string();
const userId = z.number();
const messageId = z.number();
const id = z.number();
const isActive = z.boolean().optional();

// schema
export const zAdminMessagesGet = z.object({ isActive });
export const zCreateAdminMessage = z.object({ title, description, userId });
export const zUpdateAdminMessage = z.object({ title, description, messageId });

// types
export type iCreateAdminMessage = z.infer<typeof zCreateAdminMessage>;
export type iUpdateAdminMessage = z.infer<typeof zUpdateAdminMessage>;
