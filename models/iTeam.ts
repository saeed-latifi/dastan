import { z } from "zod";

const id = z.number();
const title = z.string().min(3).max(50);
const description = z.string().min(3).max(300);

export const zTeamContact = z.string().min(5, "so short!").max(200, "so long!");
const contactMethods = z.array(zTeamContact).max(5).optional();

// schema
export const zTeamCreate = z.object({ title, description, contactMethods });
export const zTeamUpdate = z.object({ title: title.optional(), description: description.optional(), id, contactMethods });

// types
export type iTeamCreate = z.infer<typeof zTeamCreate>;
export type iTeamUpdate = z.infer<typeof zTeamUpdate>;
