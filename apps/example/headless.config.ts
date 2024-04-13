import {
	headlessConfig,
	// LibSQLAdapter,
	SQLLiteAdapter,
	// PostgresAdapter,
} from "@protoheadless/headless";
import Database from "better-sqlite3";
import transporter from "./src/headless/email-transporter.js";
// Plugins
import HeadlessNodemailer from "@protoheadless/plugin-nodemailer";
import HeadlessS3 from "@protoheadless/plugin-s3";
import HeadlessLocalStorage from "@protoheadless/plugin-local-storage";
// Collections
import PageCollection from "./src/headless/collections/pages.js";
import BlogCollection from "./src/headless/collections/blogs.js";
import SettingsCollection from "./src/headless/collections/settings.js";
import FormsCollection from "./src/headless/collections/forms.js";

export default headlessConfig({
	mode: "development",
	host: "http://localhost:8393",
	db: new SQLLiteAdapter({
		database: async () => new Database("db.sqlite"),
	}),
	// db: new LibSQLAdapter({
	// 	url: "libsql://headless-cms-willyallop.turso.io",
	// 	authToken: process.env.TURSO_AUTH_TOKEN as string,
	// }),
	// db: new PostgresAdapter({
	// 	connectionString: process.env.DATABASE_URL as string,
	// 	max: 20,
	// 	ssl: {
	// 		rejectUnauthorized: false,
	// 	},
	// }),
	keys: {
		cookieSecret: process.env.HEADLESS_COOKIE_SECRET as string,
		refreshTokenSecret: process.env.HEADLESS_REFRESH_TOKEN_SECRET as string,
		accessTokenSecret: process.env.HEADLESS_ACCESS_TOKEN_SECRET as string,
	},
	media: {
		processed: {
			store: true,
		},
	},
	hooks: [
		{
			service: "collection-documents",
			event: "beforeCreate",
			handler: async (data, context) => {
				console.log("beforeCreate hook global");
			},
		},
	],
	collections: [
		PageCollection,
		BlogCollection,
		SettingsCollection,
		FormsCollection,
	],
	plugins: [
		HeadlessNodemailer({
			from: {
				email: "admin@protoheadless.com",
				name: "Protoheadless",
			},
			transporter: transporter,
		}),
		// HeadlessS3({
		// 	clientConfig: {
		// 		endpoint: `https://${process.env.HEADLESS_CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
		// 		region: "auto",
		// 		credentials: {
		// 			accessKeyId: process.env.HEADLESS_S3_ACCESS_KEY as string,
		// 			secretAccessKey: process.env
		// 				.HEADLESS_S3_SECRET_KEY as string,
		// 		},
		// 	},
		// 	bucket: "headless-cms",
		// }),
		HeadlessLocalStorage({
			uploadDir: "uploads",
		}),
	],
});
