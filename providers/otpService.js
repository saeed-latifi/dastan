import Ghasedak from "ghasedak";
import { smsKey, smsTemplate } from "statics/keys";

let ghasedak = new Ghasedak(smsKey);

export async function sendSMS({ phoneNumber, code }) {
	try {
		const info = await ghasedak.verification({ receptor: phoneNumber, type: "1", template: smsTemplate, param1: code });
		return true;
	} catch (error) {
		return false;
	}
}
