import nodemailer from "nodemailer";
import aws from "@aws-sdk/client-ses";
import { headlessConfig } from "@protodigital/headless";
import {
	BannerBrick,
	IntroBrick,
	DefaultMetaBrick,
	TestingBrick,
	PageMetaBrick,
} from "./src/bricks/index.js";
import {
	PageCollection,
	SettingsCollection,
	BlogCollection,
} from "./src/collections/index.js";

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
			name: "Headless CMS",
			email: "hello@protoheadless.com",
		},
		transporter: nodemailer.createTransport({
			SES: {
				ses: new aws.SES({
					apiVersion: "2010-12-01",
					region: "eu-west-2",
				}),
				aws: aws,
			},
		}),
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
