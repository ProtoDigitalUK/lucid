import lucid, { SQLiteAdapter, CollectionBuilder } from "../../../index.js";
import Database from "better-sqlite3";

export default lucid.config({
	host: "http://localhost:8393",
	db: new SQLiteAdapter({
		database: async () => new Database("db.sqlite"),
	}),
	keys: {
		encryptionKey: "encryptionKey",
		cookieSecret: "cookieSecret",
		refreshTokenSecret: "refreshTokenSecret",
		accessTokenSecret: "accessTokenSecret",
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
