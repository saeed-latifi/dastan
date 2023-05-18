import { z } from "zod";

export const zAttachment = z.string().min(3, "more than 3 character");
export const zAttachments = z.array(zAttachment).max(5, "no more than 5 term");
