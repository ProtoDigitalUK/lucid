import { headlessConfig, SQLLiteAdapter } from "../../../index.js";
import Database from "better-sqlite3";

export default headlessConfig({
	mode: "development",
	host: "http://localhost:8393",
	db: new SQLLiteAdapter({
		database: async () => new Database("db.sqlite"),
	}),
	keys: {
		cookieSecret: "cookieSecret",
		refreshTokenSecret: "refreshTokenSecret",
		accessTokenSecret: "accessTokenSecret",
	},
	collections: [],
	plugins: [],
});
