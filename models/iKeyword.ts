import { z } from "zod";

export const zKeyword = z.string().min(3, "more than 3 character");
export const zKeywords = z.array(zKeyword).max(5, "no more than 5 term");
