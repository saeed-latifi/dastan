import { z } from "zod";

const resumeContext = z.string().min(10);

// schema
export const zResumeFeed = z.object({ username: z.string() });
export const zResumeUpdate = z.object({ resumeContext });
export const zRemovePortfo = z.object({ imageName: z.string() });
export const zFollow = z.object({ userId: z.number() });

// type
export type iResumeFeed = z.infer<typeof zResumeFeed>;
export type iResumeUpdate = z.infer<typeof zResumeUpdate>;
export type iRemovePortfo = z.infer<typeof zRemovePortfo>;
export type iFollow = z.infer<typeof zFollow>;
