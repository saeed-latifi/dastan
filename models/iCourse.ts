import { z } from "zod";
import { zKeyword } from "./iKeyword";

const id = z.number();
const authorId = z.number();
const title = z.string().min(5, "more than 5 character");
const description = z.string().min(5, "more than 5 character");
const categoryId = z.number();

// optional
const keywords = z.array(zKeyword).max(5, "no more than 5 term").optional();

// schema
export const zCourseCreate = z.object({ title, description, categoryId, keywords });
export const zCourseUpdate = z.object({ title, description, categoryId, keywords }).partial().merge(z.object({ id }));
export const zCourseCreateForm = z.object({ title, description });

// types
export type iCourseCreate = z.infer<typeof zCourseCreate>;
export type iCourseUpdate = z.infer<typeof zCourseUpdate>;
export type iCourseCreateForm = z.infer<typeof zCourseCreateForm>;
