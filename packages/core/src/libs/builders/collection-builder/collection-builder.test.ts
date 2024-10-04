import { expect, test } from "vitest";
import CollectionBuilder from "./index.js";

test("collection config is correct along with field includes and filters", async () => {
	const pagesCollection = new CollectionBuilder("pages", {
		mode: "multiple",
		title: "Pages",
		singular: "Page",
		description: "Pages are used to create static content on your website.",
		translations: true,
		hooks: [
			{
				event: "beforeUpsert",
				handler: async (props) => {
					return {
						error: undefined,
						data: undefined,
					};
				},
			},
			{
				event: "beforeDelete",
				handler: async (props) => {
					return {
						error: undefined,
						data: undefined,
					};
				},
			},
			{
				event: "afterDelete",
				handler: async (props) => {
					return {
						error: undefined,
						data: undefined,
					};
				},
			},
			{
				event: "afterUpsert",
				handler: async (props) => {
					return {
						error: undefined,
						data: undefined,
					};
				},
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
		})
		.addNumber("number_test", undefined, {
			list: true,
			filterable: true,
		})
		.addCheckbox("checkbox_test", undefined, {
			list: true,
			filterable: true,
		})
		.addSelect("select_test", undefined, {
			list: true,
			filterable: true,
		})
		.addDateTime("datetime_test", undefined, {
			list: true,
			filterable: true,
		})
		.addUser("user_test", undefined, {
			list: true,
		})
		.addMedia("media_test", undefined, {
			list: true,
			filterable: true,
		})
		.addWysiwyg("wysiwyg_test")
		.addLink("link_test")
		.addJSON("json_test")
		.addColour("colour_test")
		.addRepeater("repeater_test")
		.addText("repeater_text_test")
		.endRepeater();

	expect(pagesCollection.fields.size).toBe(14);

	expect(pagesCollection.data).toEqual({
		key: "pages",
		mode: "multiple",
		title: "Pages",
		singular: "Page",
		description: "Pages are used to create static content on your website.",
		locked: false,
		useDraft: false,
		useRevisions: false,
		config: {
			translations: true,
			fields: {
				filter: [
					{ key: "text_test", type: "text" },
					{ key: "textarea_test", type: "textarea" },
					{ key: "number_test", type: "number" },
					{ key: "checkbox_test", type: "checkbox" },
					{ key: "select_test", type: "select" },
					{ key: "datetime_test", type: "datetime" },
					{ key: "media_test", type: "media" },
				],
				include: [
					"text_test",
					"textarea_test",
					"number_test",
					"checkbox_test",
					"select_test",
					"datetime_test",
					"user_test",
					"media_test",
				],
			},
		},
	});
});
