import z from "zod";

const title = z.string();

const courseId = z.number();

const id = z.number();

// schema
export const zLessonCreate = z.object({
	title,
	courseId,
});

export const zLessonUpdate = z.object({
	title: title.optional(),
	courseId: courseId.optional(),

	id,
});

// types
export type iLessonCreate = z.infer<typeof zLessonCreate>;
export type iLessonUpdate = z.infer<typeof zLessonUpdate>;
