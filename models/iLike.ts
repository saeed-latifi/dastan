import { z } from "zod";

const isLike = z.boolean();
const contentId = z.number();

// schema
export const zLike = z.object({ isLike, contentId });

// types
export type iLike = z.infer<typeof zLike>;
