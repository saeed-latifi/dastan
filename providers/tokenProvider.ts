import { setCookie } from "cookies-next";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { tokenStatics } from "@static/keys";

type token = { userId: number; permissionLevel: number; username: string; slug: string };
export function tokenValidator(token: string): token | false {
	try {
		const decoded = jwt.verify(token, process.env.TOKEN_KEY as string) as any;
		return {
			userId: parseInt(decoded.userId),
			permissionLevel: parseInt(decoded.permissionLevel),
			username: decoded.username,
			slug: decoded.slug,
		};
	} catch (error) {
		return false;
	}
}

export function tokenCreator(userInfo: token): string {
	const token = jwt.sign(userInfo, process.env.TOKEN_KEY as string);
	return token;
}

type setCookieTokenArgs = { token: any; req: NextApiRequest; res: NextApiResponse };
export function setCookieToken({ token, req, res }: setCookieTokenArgs) {
	setCookie("token", token, {
		req,
		res,
		maxAge: tokenStatics.tokenMaxAge,
		domain: tokenStatics.tokenDomain,
		path: tokenStatics.tokenPath,
		sameSite: true,
	});
}

type removeCookieTokenArgs = { req: NextApiRequest; res: NextApiResponse };
export function removeCookieToken({ req, res }: removeCookieTokenArgs) {
	setCookie("token", "", {
		req,
		res,
		maxAge: 1,
		domain: tokenStatics.tokenDomain,
		path: tokenStatics.tokenPath,
		sameSite: true,
	});
}

// Email
type tokenEmail = { email: string };
export function emailTokenCreator({ email }: tokenEmail): string {
	const token = jwt.sign({ email }, process.env.EMAIL_TOKEN_KEY as string, { expiresIn: "6h" });
	return token;
}

export function emailTokenValidator(token: string): tokenEmail | false {
	try {
		const decoded = jwt.verify(token, process.env.EMAIL_TOKEN_KEY as string) as any;
		return {
			email: decoded.email,
		};
	} catch (error) {
		return false;
	}
}

// change Email
type tokenChangeEmail = { newEmail: string; oldEmail: string };
export function changeEmailTokenCreator({ newEmail, oldEmail }: tokenChangeEmail): string {
	const token = jwt.sign({ newEmail, oldEmail }, process.env.EMAIL_TOKEN_KEY as string, { expiresIn: "6h" });
	return token;
}

export function changeEmailTokenValidator(token: string): tokenChangeEmail | false {
	try {
		const decoded = jwt.verify(token, process.env.EMAIL_TOKEN_KEY as string) as any;
		return {
			newEmail: decoded.newEmail,
			oldEmail: decoded.oldEmail,
		};
	} catch (error) {
		return false;
	}
}
