import { z } from "zod";

const id = z.number();
const username = z.string().min(3, "please enter your username more than 3 character").max(30, "no more 30 character");
const email = z.string().email("please enter valid email").max(70, "no more 70 character");
const password = z.string().min(6, "please enter password more than 6 character").max(30, "no more 30 character");
const confirm = z.string().optional();

// more
const firstName = z.string().min(3, "please enter your first name more than 3 character").max(30, "no more 30 character").optional();
const lastName = z.string().min(3, "please enter your last name more than 3 character").max(30, "no more 30 character").optional();
const phone = z
	.string()
	.length(10, "please enter your phone number in 10 character format")
	.regex(/^\d+$/, "not valid phone number")
	.startsWith("9", "not valid phone number");
const provinceId = z.number().optional();
const interests = z.array(z.object({ id: z.number(), title: z.string() })).optional();

// read only
const isActive = z.boolean().optional();
const permissionLevel = z.number().optional();
const RegisterDate = z.date().optional();

// schema

export const zPhone = z.object({ phone });
export const zUserEmail = z.object({ email });
export const zUserLogin = z.object({ email, password });
export const zUserUpdate = z.object({ username, firstName, lastName, interests, provinceId }).partial();
export const zUserCreate = z
	.object({ email, password, username, confirm, firstName, lastName })
	.refine((data) => data.password === data.confirm, { message: "confirm Passwords don't match", path: ["confirm"] });
export const zPasswordUpdate = z
	.object({ oldPassword: password, newPassword: password, confirm })
	.refine((data) => data.newPassword === data.confirm, { message: "Passwords don't match", path: ["confirm"] });
export const zResetPassword = z
	.object({ password, confirm })
	.refine((data) => data.password === data.confirm, { message: "confirm Passwords don't match", path: ["confirm"] });

// types
export type iPasswordUpdate = z.infer<typeof zPasswordUpdate>;
export type iUserUpdate = z.infer<typeof zUserUpdate>;
export type iUserLogin = z.infer<typeof zUserLogin>;
export type iUserCreate = z.infer<typeof zUserCreate>;
export type iUserEmail = z.infer<typeof zUserEmail>;
export type iResetPassword = z.infer<typeof zResetPassword>;
export type iPhone = z.infer<typeof zPhone>;
