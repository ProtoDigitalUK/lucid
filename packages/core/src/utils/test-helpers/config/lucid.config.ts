import lucid, { SQLiteAdapter } from "@lucidcms/core";
import Database from "better-sqlite3";

export default lucid.config({
	host: "http://localhost:8393",
	db: new SQLiteAdapter({
		database: async () => new Database("db.sqlite"),
	}),
	keys: {
		encryptionKey:
			"a9876b549a7d3d0350a5995a0c81a73452bccfa8b489f5dca8bd83ecbb6a8cba",
		cookieSecret:
			"a9876b549a7d3d0350a5995a0c81a73452bccfa8b489f5dca8bd83ecbb6a8cba",
		refreshTokenSecret:
			"a9876b549a7d3d0350a5995a0c81a73452bccfa8b489f5dca8bd83ecbb6a8cba",
		accessTokenSecret:
			"a9876b549a7d3d0350a5995a0c81a73452bccfa8b489f5dca8bd83ecbb6a8cba",
	},
	collections: [],
	plugins: [],
});
