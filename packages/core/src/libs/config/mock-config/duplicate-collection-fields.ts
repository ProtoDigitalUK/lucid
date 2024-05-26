import lucid, { SQLiteAdapter, CollectionBuilder } from "../../../index.js";
import Database from "better-sqlite3";

const collection = new CollectionBuilder("page", {
	mode: "multiple",
	title: "Pages",
	singular: "Page",
})
	.addText({
		key: "title",
	})
	.addText({
		key: "title",
	});

export default lucid.config({
	host: "http://localhost:8393",
	db: new SQLiteAdapter({
		database: async () => new Database("db.sqlite"),
	}),
	keys: {
		cookieSecret: "cookieSecret",
		refreshTokenSecret: "refreshTokenSecret",
		accessTokenSecret: "accessTokenSecret",
	},
	collections: [collection],
	plugins: [],
});
