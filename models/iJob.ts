import { WageType } from "@prisma/client";
import { z } from "zod";

const id = z.number();
const teamId = z.number();
const title = z.string().max(50);
const description = z.string().max(300);
const wageType = z.nativeEnum(WageType);
export const zJobTerm = z.string().min(5, "so short! minimum 5 character").max(200, "so long! maximum 200 character");
const categoryId = z.number();

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
export const zJobCreate = z.object({
	title,
	description,
	wageType,
	requirements: zRequirements,
	benefits: zBenefits,
	wage,
	provinceId,
	teamId,
	categoryId,
});
export const zJobUpdate = z
	.object({ title, description, wageType, requirements: zRequirements, benefits: zBenefits, wage, provinceId, categoryId })
	.partial()
	.merge(z.object({ id }));

const take = z.number();
const skip = z.number();
export const zJobFeed = z.object({ take, skip, categoryId: categoryId.optional() });
export const zJobFeedById = z.object({ id: z.number() });

// types
export type iJobCreate = z.infer<typeof zJobCreate>;
export type iJobUpdate = z.infer<typeof zJobUpdate>;
export type iJobFeedById = z.infer<typeof zJobFeedById>;
export type iJobFeed = z.infer<typeof zJobFeed>;
