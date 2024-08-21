import lucid from "../../../index.js";
import { SQLiteAdapter } from "../../../exports/adapters.js";
import { CollectionBuilder } from "../../../exports/builders.js";
import Database from "better-sqlite3";
import testingConstants from "../../../constants/testing-constants.js";

export default lucid.config({
	host: "http://localhost:8080",
	db: new SQLiteAdapter({
		database: async () => new Database("db.sqlite"),
	}),
	keys: {
		encryptionKey: testingConstants.key,
		cookieSecret: testingConstants.key,
		refreshTokenSecret: testingConstants.key,
		accessTokenSecret: testingConstants.key,
	},
	collections: [
		new CollectionBuilder("page", {
			mode: "multiple",
			title: "Pages",
			singular: "Page",
		}),
		new CollectionBuilder("page", {
			mode: "multiple",
			title: "Pages",
			singular: "Page",
		}),
	],
	plugins: [],
});
