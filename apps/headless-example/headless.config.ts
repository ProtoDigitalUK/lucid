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
		cookieSecret: process.env.HEADLESS_COOKIE_SECRET as string,
		refreshTokenSecret: process.env.HEADLESS_REFRESH_TOKEN_SECRET as string,
		accessTokenSecret: process.env.HEADLESS_ACCESS_TOKEN_SECRET as string,
	},
	email: {
		from: {
			email: "admin@protoheadless.com",
			name: "Protoheadless",
		},
		strategy: async (email, meta) => {
			try {
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
	media: {
		store: {
			service: "cloudflare",
			cloudflareAccountId: process.env.HEADLESS_CLOUDFLARE_ACCOUNT_ID,
			region: process.env.HEADLESS_S3_REGION as string,
			bucket: process.env.HEADLESS_S3_BUCKET as string,
			accessKeyId: process.env.HEADLESS_S3_ACCESS_KEY as string,
			secretAccessKey: process.env.HEADLESS_S3_SECRET_KEY as string,
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
