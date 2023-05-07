import { WageType } from "@prisma/client";
import { z } from "zod";

const id = z.number();
const title = z.string().max(50);
const description = z.string().max(300);
const wageType = z.nativeEnum(WageType);
export const zJobTerm = z.string().max(200, "so long word term").min(10, "so short word term");

// optional
const requirements = z.array(zJobTerm).max(10).optional();
const benefits = z.array(zJobTerm).max(10).optional();
const showEmail = z.boolean().optional();
const showPhone = z.boolean().optional();
const wage = z.number().optional();
const provinceId = z.number().optional();
const province = z.object({}).optional();
const keywords = z.object({}).optional();

// read only
const isActive = z.boolean();
const createdAt = z.date();
const updatedAt = z.date();
const hasCover = z.boolean();

// schema
export const zJobCreate = z.object({ title, description, wageType, requirements, showEmail, benefits, showPhone, wage, provinceId, keywords });

// types
export type iJobCreate = z.infer<typeof zJobCreate>;
