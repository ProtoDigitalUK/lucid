import lucid, {
	// LibSQLAdapter,
	SQLLiteAdapter,
	// PostgresAdapter,
} from "@lucidcms/core";
import Database from "better-sqlite3";
import transporter from "./src/lucid/email-transporter.js";
// Plugins
import LucidNodemailer from "@lucidcms/plugin-nodemailer";
import LucidS3 from "@lucidcms/plugin-s3";
import LucidLocalStorage from "@lucidcms/plugin-local-storage";
// Collections
import PageCollection from "./src/lucid/collections/pages.js";
import BlogCollection from "./src/lucid/collections/blogs.js";
import SettingsCollection from "./src/lucid/collections/settings.js";
import FormsCollection from "./src/lucid/collections/forms.js";
import HeaderMenuCollection from "./src/lucid/collections/header-menu.js";

export default lucid.config({
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
		cookieSecret: process.env.LUCID_COOKIE_SECRET as string,
		refreshTokenSecret: process.env.LUCID_REFRESH_TOKEN_SECRET as string,
		accessTokenSecret: process.env.LUCID_ACCESS_TOKEN_SECRET as string,
	},
	disableSwagger: true,
	media: {
		processed: {
			store: true,
		},
	},
	hooks: [
		{
			service: "collection-documents",
			event: "beforeUpsert",
			handler: async (props) => {
				console.log("collection doc hook", props.meta.collectionKey);
			},
		},
	],
	collections: [
		PageCollection,
		BlogCollection,
		SettingsCollection,
		FormsCollection,
		HeaderMenuCollection,
	],
	plugins: [
		LucidNodemailer({
			from: {
				email: "admin@lucidcms.io",
				name: "Lucid",
			},
			transporter: transporter,
		}),
		// LucidS3({
		// 	clientConfig: {
		// 		endpoint: `https://${process.env.LUCID_CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
		// 		region: "auto",
		// 		credentials: {
		// 			accessKeyId: process.env.LUCID_S3_ACCESS_KEY as string,
		// 			secretAccessKey: process.env
		// 				.LUCID_S3_SECRET_KEY as string,
		// 		},
		// 	},
		// 	bucket: "headless-cms",
		// }),
		LucidLocalStorage({
			uploadDir: "uploads",
		}),
	],
});
