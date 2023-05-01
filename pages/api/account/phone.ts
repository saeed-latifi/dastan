import { zPhone } from "@models/iUser";
import zodErrorMapper, { iValidationWarnings, onErrorResponse, onNotValidResponse, onSuccessResponse } from "@providers/apiResponseHandler";
import { sendSMS } from "@providers/otpService";
import UserPrismaProvider from "@providers/prismaProviders/userPrisma";
import TempOTP from "@providers/tempOTP";
import { removeCookieToken, tokenValidator } from "@providers/tokenProvider";
import { otpGenerator } from "@utilities/otpGenerator";
import { NextApiRequest, NextApiResponse } from "next";

const tempOTP = new TempOTP();
const userPrismaProvider = new UserPrismaProvider();

export default async function apiHandler(req: NextApiRequest, res: NextApiResponse) {
	// phone req
	if (req.method === "POST") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) {
				removeCookieToken({ req, res });
				return res.json(onErrorResponse("bad identify request"));
			}

			// zod
			const validate = zPhone.safeParse(req.body);
			if (!validate.success) return res.json(zodErrorMapper(validate.error.issues));

			// check not repetitive
			const notUnique = await userPrismaProvider.checkUniqueField({ phone: validate.data.phone, userId: token.userId });
			if (notUnique === "ERR") return res.json(onErrorResponse("Error on update ORM"));

			// on repetitive
			if (notUnique) {
				const validationWarnings: iValidationWarnings[] = [];
				if (validate.data.phone === notUnique.phone)
					validationWarnings.push({ name: "phone", message: "this phone number already exist" });

				return res.json(onNotValidResponse(validationWarnings));
			}

			// otp
			const otp = otpGenerator();

			// sms
			const sms = await sendSMS({ phoneNumber: "0" + validate.data.phone, code: otp });
			if (!sms) return res.json(onErrorResponse("error on send sms"));

			// store temp otp
			tempOTP.add({ code: otp, user: token.userId, phone: validate.data.phone });

			// api
			return res.json(onSuccessResponse("your code send via sms. please enter your code."));
		} catch (error) {
			return res.send("error on send SMS");
		}
	}

	// phone verify
	if (req.method === "PATCH") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) {
				removeCookieToken({ req, res });
				return res.json(onErrorResponse("bad identify request"));
			}

			// valid otp
			const otp = tempOTP.getOne(token.userId);

			if (!otp) return res.json(onErrorResponse("the otp code is expired! make another request"));
			if (otp.code !== parseInt(req.body.otp)) return res.json(onErrorResponse("not valid code!"));

			// check not repetitive
			const notUnique = await userPrismaProvider.checkUniqueField({ phone: otp.phone, userId: token.userId });
			if (notUnique === "ERR") return res.json(onErrorResponse("Error on update ORM"));

			// on repetitive
			if (notUnique) {
				const validationWarnings: iValidationWarnings[] = [];
				if (otp.phone === notUnique.phone) validationWarnings.push({ name: "phone", message: "this phone number already exist" });

				return res.json(onNotValidResponse(validationWarnings));
			}

			// prisma
			const user = await userPrismaProvider.addPhone({ id: token.userId, phone: otp.phone });
			if (user === "ERR") return res.json(onErrorResponse("err on add phone ORM"));
			if (user === null) return res.json(onNotValidResponse([{ name: "not found", message: "not found this user" }]));

			// otp purge
			tempOTP.remove(token.userId);

			// api
			return res.json(onSuccessResponse(user));
		} catch (error) {
			return res.send("error on send SMS");
		}
	}

	// not supported method
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
