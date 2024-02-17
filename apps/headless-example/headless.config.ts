import { headlessConfig } from "@protodigital/headless";
import transporter from "./src/services/email-transporter.js";
import {
	BannerBrick,
	IntroBrick,
	DefaultMetaBrick,
	TestingBrick,
	PageMetaBrick,
} from "./src/headless/bricks/index.js";
import {
	PageCollection,
	SettingsCollection,
	BlogCollection,
} from "./src/headless/collections/index.js";

export default headlessConfig({
	mode: "development",
	host: "http://localhost:8393",
	databaseURL: process.env.DATABASE_URL as string,
	keys: {
		cookieSecret: process.env.COOKIE_SECRET as string,
		refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,
		accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as string,
	},
	email: {
		from: {
			email: "admin@protoheadless.com",
			name: "Protoheadless",
		},
		strategy: async (email, meta) => {
			try {
				console.log({
					from: `${email.from.name} <${email.from.email}>`,
					to: email.to,
					subject: email.subject,
					cc: email.cc,
					bcc: email.bcc,
					replyTo: email.replyTo,
					text: email.text,
					html: email.html,
				});

				await transporter.sendMail({
					from: `${email.from.name} <${email.from.email}>`,
					to: email.to,
					subject: email.subject,
					cc: email.cc,
					bcc: email.bcc,
					replyTo: email.replyTo,
					text: email.text,
					html: email.html,
				});

				return {
					success: true,
					message: "Email sent successfully",
				};
			} catch (error) {
				const err = error as Error;
				return {
					success: false,
					message: err.message,
				};
			}
		},
	},
	collections: [PageCollection, BlogCollection, SettingsCollection],
	bricks: [
		BannerBrick,
		IntroBrick,
		DefaultMetaBrick,
		TestingBrick,
		PageMetaBrick,
	],
});
