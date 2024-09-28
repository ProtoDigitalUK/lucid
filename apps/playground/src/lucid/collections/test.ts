import { z } from "@lucidcms/core";
import { CollectionBuilder } from "@lucidcms/core/builders";

const TestCollection = new CollectionBuilder("test", {
	mode: "multiple",
	title: "Test",
	singular: "Test",
	description:
		"A test collection for the revisions and draft/published functionality.",
	translations: true,
	hooks: [],
	bricks: {},
})
	.addText(
		"title",
		{
			labels: {
				title: {
					en: "Title",
				},
			},
			hidden: false,
			disabled: false,
			validation: {
				required: true,
				zod: z.string().min(2).max(128),
			},
		},
		{
			list: true,
			filterable: true,
		},
	)
	.addDocument("document", {
		collection: "test",
	});

export default TestCollection;
