import { z } from "zod";

// schema
export const zResumeFeed = z.object({ username: z.string() });
export const zFollow = z.object({ userId: z.number() });

// type
export type iResumeFeed = z.infer<typeof zResumeFeed>;
export type iFollow = z.infer<typeof zFollow>;
