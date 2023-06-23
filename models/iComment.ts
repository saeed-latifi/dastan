import { z } from "zod";

const contentId = z.number();
const id = z.number();
const description = z.string().max(200, "less than 200 character").min(10, "more than 10 character");
const parentId = z.number().optional();
const replyId = z.number().optional();

// schema
export const zCommentGet = z.object({ contentId });
export const zCommentCreate = z.object({ contentId, description, parentId, replyId });
export const zCommentDelete = z.object({ id });
export const zCommentCreateForm = z.object({ description });

// types
export type iCommentGet = z.infer<typeof zCommentGet>;

export type iCommentCreate = z.infer<typeof zCommentCreate>;
export type iCommentCreateForm = z.infer<typeof zCommentCreateForm>;
