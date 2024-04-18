import headless, { SQLLiteAdapter, CollectionBuilder } from "../../../index.js";
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

export default headless.config({
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
	collections: [collection],
	plugins: [],
});
