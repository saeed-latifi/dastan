import { z } from "zod";

const title = z.string();
const description = z.string();
const userId = z.number();
const id = z.number();
const isActive = z.boolean().optional();

// schema
export const zAdminMessagesGet = z.object({ isActive });
export const zCreateAdminMessage = z.object({ title, description, userId });

// types
export type iCreateAdminMessage = z.infer<typeof zCreateAdminMessage>;
