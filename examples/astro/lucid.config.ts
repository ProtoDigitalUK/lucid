import lucid, { SQLiteAdapter } from "@lucidcms/core";
import Database from "better-sqlite3";
import PageCollection from "./src/lucid/collections/pages.js";

export default lucid.config({
	host: "http://localhost:8393",
	db: new SQLiteAdapter({
		database: async () => new Database("db.sqlite"),
	}),
	keys: {
		encryptionKey:
			"t9fifQwgYZEbMzUjLlUjEV^Lh|WD*Q,1xo/W6xo*cf5P&+0%37t:PlH&c:CvnL-`",
		cookieSecret:
			"t9fifQwgYZEbMzUjLlUjEV^Lh|WD*Q,1xo/W6xo*cf5P&+0%37t:PlH&c:CvnL-`",
		refreshTokenSecret:
			"t9fifQwgYZEbMzUjLlUjEV^Lh|WD*Q,1xo/W6xo*cf5P&+0%37t:PlH&c:CvnL-`",
		accessTokenSecret:
			"t9fifQwgYZEbMzUjLlUjEV^Lh|WD*Q,1xo/W6xo*cf5P&+0%37t:PlH&c:CvnL-`",
	},
	collections: [PageCollection],
	plugins: [],
});
