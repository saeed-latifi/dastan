import { JobType } from "@prisma/client";
import { z } from "zod";

const id = z.number();
const title = z.string().max(50);
const description = z.string().max(300);
const jobType = z.nativeEnum(JobType);

// optional
const needs = z.array(z.string().max(100).min(5)).max(10);
const gives = z.array(z.string().max(100).min(5)).max(10);
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
export const zJobCreate = z.object({ title, description, jobType, needs, showEmail, gives, showPhone, wage, provinceId, keywords });

// types
export type iJobCreate = z.infer<typeof zJobCreate>;
