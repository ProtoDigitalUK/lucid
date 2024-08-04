import lucid, {
	SQLiteAdapter,
	PostgresAdapter,
	LibSQLAdapter,
} from "@lucidcms/core";
import Database from "better-sqlite3";
import transporter from "./src/services/email-transporter.js";
// Plugins
import LucidNodemailer from "@lucidcms/plugin-nodemailer";
// import LucidS3 from "@lucidcms/plugin-s3";
import LucidPages from "@lucidcms/plugin-pages";
import LucidLocalStorage from "@lucidcms/plugin-local-storage";
// Collections
import PageCollection from "./src/lucid/collections/pages.js";
import BlogCollection from "./src/lucid/collections/blogs.js";
import SettingsCollection from "./src/lucid/collections/settings.js";

export default lucid.config({
	host: "http://localhost:8393",
	db: new SQLiteAdapter({
		database: async () => new Database("db.sqlite"),
	}),
	// db: new PostgresAdapter({
	// 	connectionString: process.env.DATABASE_URL as string,
	// }),
	// db: new LibSQLAdapter({
	// 	url: "libsql://lucid-willyallop.turso.io",
	// 	authToken: process.env.TURSO_AUTH_TOKEN as string,
	// }),
	keys: {
		encryptionKey: process.env.LUCID_ENCRYPTION_KEY as string,
		cookieSecret: process.env.LUCID_COOKIE_SECRET as string,
		refreshTokenSecret: process.env.LUCID_REFRESH_TOKEN_SECRET as string,
		accessTokenSecret: process.env.LUCID_ACCESS_TOKEN_SECRET as string,
	},
	localisation: {
		locales: [
			{
				label: "English",
				code: "en",
			},
			{
				label: "French",
				code: "fr",
			},
		],
		defaultLocale: "en",
	},
	// disableSwagger: true,
	media: {
		processed: {
			store: true,
		},
		fallbackImage: "https://placehold.co/600x400",
	},
	// hooks: [
	// 	{
	// 		service: "collection-documents",
	// 		event: "beforeUpsert",
	// 		handler: async (props) => {
	// 			console.log("collection doc hook", props.meta.collectionKey);
	// 		},
	// 	},
	// ],
	collections: [PageCollection, BlogCollection, SettingsCollection],
	plugins: [
		LucidPages({
			collections: [
				{
					key: "page",
					homepage: true,
				},
			],
		}),
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
