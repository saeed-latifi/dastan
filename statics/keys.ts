// base user token
const tokenDomainLocal = "localhost";
const tokenDomainDastan = "dastandev.ir";
export const tokenStatics = { tokenMaxAge: 60 * 60 * 12 * 30, tokenDomain: tokenDomainLocal, tokenPath: "/" };

// email callback domain
const emailDomainLocal = "http://localhost:3000";
const emailDomainDastan = "dastandev.ir";
export const emailDomain = emailDomainLocal;

// external media
export const bucketUrl = "https://dastan.storage.iran.liara.space";
export const bucketName = "dastan";
export const AWSProfileConfig = {
	endpoint: "storage.iran.liara.space",
	accessKeyId: process.env.BUCKET_ACCESS_KEY,
	secretAccessKey: process.env.BUCKET_SECRET_KEY,
	region: "default",
};

// permission levels definition
export const permissionLevels = { phoneSubmit: 2 };

// sms
export const smsKey = process.env.SMS_KEY;
export const smsTemplate = process.env.SMS_TEMPLATE;

// json schemas
export { default as themeColors } from "./theme-colors.json";
