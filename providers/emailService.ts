import nodemailer from "nodemailer";
import { changeEmailTokenCreator, emailTokenCreator } from "./tokenProvider";
import { emailDomain } from "statics/keys";
import { staticURLs } from "statics/url";

const emailStyle = `
	<style>
		h1 {
			color: blue;
		}
		button {
			background-color: darkgoldenrod;
			outline: none;
		}
		a {
			outline: none;
			cursor: pointer;
		}
	</style>`;

const authHTMLGenerator = (link: string) => {
	const domain = `${emailDomain}${staticURLs.client.verify}`;
	return `
<html>
    <head>
        ${emailStyle}
    </head>
    <body>
        <h1>verify your email</h1>
		<button>
			<a href="${domain + "?token=" + link}" target="_blank">
				active your account
			</a>
		</button>
    </body>
</html>
`;
};

const recoverPasswordHTMLGenerator = (link: string) => {
	const domain = `${emailDomain}${staticURLs.client.account.resetPassword}`;
	return `
<html>
    <head>
        ${emailStyle}
    </head>
    <body>
        <h1>reset your password</h1>
		<button>
			<a href="${domain + "?token=" + link}" target="_blank">
				reset your password
			</a>
		</button>
    </body>
</html>
`;
};

const changeEmailNewHTMLGenerator = (link: string) => {
	const domain = `${emailDomain}${staticURLs.client.account.confirmNewEmail}`;
	return `
<html>
    <head>
        ${emailStyle}
    </head>
    <body>
        <h1>confirm your new email</h1>
		<button>
			<a href="${domain + "?token=" + link}" target="_blank">
				confirm your new email
			</a>
		</button>
    </body>
</html>
`;
};

const changeEmailOldHTMLGenerator = (newEmail: string) => {
	return `
<html>
    <head>
        ${emailStyle}
    </head>
    <body>
        <h1>changed email</h1>
		<p>
			you changed your account email to ${newEmail}
		</p>
		<p>
			If you haven't, report to our support
		</p>
    </body>
</html>
`;
};

const fromDastan = "support@mail.dastandev.ir";

// liara mail
const transporter = nodemailer.createTransport({
	host: "smtp.c1.liara.email",
	port: 587,
	tls: {
		ciphers: "SSLv3",
		rejectUnauthorized: false,
	},
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASSWORD,
	},
});

export async function authEmailSender({ email }: { email: string }) {
	try {
		await transporter.sendMail({
			from: `" dastan game studio" <${fromDastan}>`,
			to: email,
			subject: "Email verify",
			text: "verify your Email",
			html: authHTMLGenerator(emailTokenCreator({ email })),
		});
		return true;
	} catch (error) {
		return false;
	}
}

export async function recoverPasswordEmailSender({ email }: { email: string }) {
	try {
		await transporter.sendMail({
			from: `" dastan game studio" <${fromDastan}>`,
			to: email,
			subject: "reset password",
			text: "reset password",
			html: recoverPasswordHTMLGenerator(emailTokenCreator({ email })),
		});
		return true;
	} catch (error) {
		return false;
	}
}

export async function changeEmailEmailSender({ newEmail, oldEmail }: { newEmail: string; oldEmail: string }) {
	function firstSender() {
		return transporter.sendMail({
			from: `" dastan game studio" <${fromDastan}>`,
			to: newEmail,
			subject: "modify your account email",
			text: "you changed your account email",
			html: changeEmailNewHTMLGenerator(changeEmailTokenCreator({ newEmail, oldEmail })),
		});
	}

	function secondSender() {
		return transporter.sendMail({
			from: `" dastan game studio" <${fromDastan}>`,
			to: oldEmail,
			subject: "modify your account email",
			text: "you changed your account email",
			html: changeEmailOldHTMLGenerator(newEmail),
		});
	}

	try {
		await Promise.all([firstSender(), secondSender()]);
		return true;
	} catch (error) {
		return false;
	}
}
