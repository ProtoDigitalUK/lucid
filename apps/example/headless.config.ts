import {
	headlessConfig,
	// LibSQLAdapter,
	SQLLiteAdapter,
	// PostgresAdapter,
} from "@protodigital/headless";
import Database from "better-sqlite3";
import transporter from "./src/headless/email-transporter.js";
// Plugins
import NodemailerPlugin from "@protodigital/headless-plugin-nodemailer";
import S3Plugin from "@protodigital/headless-plugin-s3";
import LocalStoragePlugin from "@protodigital/headless-plugin-local-storage";
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
	collections: [
		PageCollection,
		BlogCollection,
		SettingsCollection,
		FormsCollection,
	],
	plugins: [
		NodemailerPlugin({
			from: {
				email: "admin@protoheadless.com",
				name: "Protoheadless",
			},
			transporter: transporter,
		}),
		S3Plugin({
			clientConfig: {
				endpoint: `https://${process.env.HEADLESS_CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
				region: "auto",
				credentials: {
					accessKeyId: process.env.HEADLESS_S3_ACCESS_KEY as string,
					secretAccessKey: process.env
						.HEADLESS_S3_SECRET_KEY as string,
				},
			},
			bucket: "headless-cms",
		}),
		// LocalStoragePlugin({
		// 	uploadDir: "uploads",
		// }),
	],
});
