import { zPhone } from "@models/iUser";
import { errorType, onErrorResponse, onSuccessResponse, onZodErrorResponse } from "@providers/apiResponseHandler";
import { sendSMS } from "@providers/otpService";
import UserPrismaProvider from "@providers/prismaProviders/userPrisma";
import TempOTP from "@providers/tempOTP";
import { tokenFixer, tokenValidator } from "@providers/tokenProvider";
import { errorLogger } from "@utilities/apiLogger";
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
			if (!token) return tokenFixer({ req, res });

			// zod
			const validate = zPhone.safeParse(req.body);
			if (!validate.success) return res.json(onZodErrorResponse(validate.error.issues));

			// check not repetitive
			const notUnique = await userPrismaProvider.checkUniqueField({ phone: validate.data.phone, userId: token.userId });

			// on repetitive
			if (notUnique) {
				const validationErrors: errorType = {};
				if (validate.data.phone === notUnique.phone) validationErrors.phone = "this phone number already taken";
				return res.json(onErrorResponse(validationErrors));
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
			return errorLogger({ error, res, name: "phone" });
		}
	}

	// phone verify
	if (req.method === "PATCH") {
		try {
			// token
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) return tokenFixer({ req, res });

			// valid otp
			const otp = tempOTP.getOne(token.userId);

			if (!otp) return res.json(onErrorResponse("the otp code is expired! make another request"));
			if (otp.code !== parseInt(req.body.otp)) return res.json(onErrorResponse("not valid code!"));

			// check not repetitive
			const notUnique = await userPrismaProvider.checkUniqueField({ phone: otp.phone, userId: token.userId });

			// on repetitive
			if (notUnique) {
				const validationErrors: errorType = {};
				if (otp.phone === notUnique.phone) validationErrors.phone = "this phone number already taken";
				return res.json(onErrorResponse(validationErrors));
			}

			// prisma
			const user = await userPrismaProvider.addPhone({ id: token.userId, phone: otp.phone });
			if (user === null) return res.json(onErrorResponse("not found this user"));

			// otp purge
			tempOTP.remove(token.userId);

			// api
			return res.json(onSuccessResponse(user));
		} catch (error) {
			return errorLogger({ error, res, name: "phone" });
		}
	}

	// not supported method
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
