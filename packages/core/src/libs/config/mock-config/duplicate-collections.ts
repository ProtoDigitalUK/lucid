import lucid, { SQLLiteAdapter, CollectionBuilder } from "../../../index.js";
import Database from "better-sqlite3";

export default lucid.config({
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
