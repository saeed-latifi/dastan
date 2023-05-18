import z from "zod";
import { zKeywords } from "./iKeyword";

const title = z.string();
const description = z.string();
const videoUrl = z.string();
const courseId = z.number();
const attachments = z.array(z.string());
const contentId = z.string();

// schema
export const zLessonCreate = z.object({
	title,
	description,
	courseId,
	videoUrl,
	attachments: attachments.optional(),
	keywords: zKeywords.optional(),
});

export const zLessonUpdate = z.object({
	title: title.optional(),
	description: description.optional(),
	videoUrl: videoUrl.optional(),
	courseId: courseId.optional(),
	attachments: attachments.optional(),
	keywords: zKeywords.optional(),
	contentId,
});

// types
export type iLessonCreate = z.infer<typeof zLessonCreate>;
export type iLessonUpdate = z.infer<typeof zLessonUpdate>;
