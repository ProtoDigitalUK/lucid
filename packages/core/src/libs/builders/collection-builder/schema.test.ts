import { expect, test } from "vitest";
import CollectionBuilder from "./index.js";
import CollectionConfigSchema from "./schema.js";

test("collection builder config passes schema validation", async () => {
	const collection = new CollectionBuilder("pages", {
		mode: "multiple",
		title: "Pages",
		singular: "Page",
		description: "Pages are used to create static content on your website.",
		translations: true,
		hooks: [
			{
				event: "beforeUpsert",
				handler: async (props) => {},
			},
			{
				event: "beforeDelete",
				handler: async (props) => {},
			},
			{
				event: "afterDelete",
				handler: async (props) => {},
			},
			{
				event: "afterUpsert",
				handler: async (props) => {},
			},
		],
	})
		.addText("text_test", undefined, {
			list: true,
			filterable: true,
		})
		.addTextarea("textarea_test", undefined, {
			list: true,
			filterable: true,
		});

	const res = await CollectionConfigSchema.safeParseAsync(collection.config);
	expect(res.success).toBe(true);
});
