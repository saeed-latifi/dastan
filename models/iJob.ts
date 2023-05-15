import { WageType } from "@prisma/client";
import { z } from "zod";

const id = z.number();
const teamId = z.number();
const title = z.string().max(50);
const description = z.string().max(300);
const wageType = z.nativeEnum(WageType);
export const zJobTerm = z.string().min(5, "so short! minimum 5 character").max(200, "so long! maximum 200 character");

// optional
export const zRequirements = z.array(zJobTerm).max(5, "no more than 5 term").optional();
export const zBenefits = z.array(zJobTerm).max(5, "no more than 5 term").optional();
const wage = z.number().optional();
const provinceId = z.number().nullish();

// read only
const isActive = z.boolean();
const createdAt = z.date();
const updatedAt = z.date();

// schema
export const zJobCreate = z.object({ title, description, wageType, requirements: zRequirements, benefits: zBenefits, wage, provinceId, teamId });
export const zJobUpdate = z
	.object({ title, description, wageType, requirements: zRequirements, benefits: zBenefits, wage, provinceId })
	.partial()
	.merge(z.object({ id }));

// types
export type iJobCreate = z.infer<typeof zJobCreate>;
export type iJobUpdate = z.infer<typeof zJobUpdate>;
