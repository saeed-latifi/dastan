import { z } from "zod";

const take = z.number();
const skip = z.number();

// schema
export const zPagination = z.object({ take, skip });

// types
export type iPagination = z.infer<typeof zPagination>;
