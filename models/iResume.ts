import { z } from "zod";

const resumeContext = z.string();

// schema
export const zResumeFeed = z.object({ username: z.string() });
export const zResumeUpdate = z.object({ resumeContext });
export const zFollow = z.object({ userId: z.number() });

// type
export type iResumeFeed = z.infer<typeof zResumeFeed>;
export type iFollow = z.infer<typeof zFollow>;
