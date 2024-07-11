import { CollectionBuilder } from "@lucidcms/core";

const PageCollection = new CollectionBuilder("page", {
	mode: "multiple",
	title: "Pages",
	singular: "Page",
	description: "Manage the pages and content on your website.",
	translations: true,
	bricks: {
		fixed: [],
		builder: [],
	},
})
	.addText(
		"page_title",
		{
			labels: {
				title: {
					en: "Page title",
				},
				description: "The title of the page.",
			},
		},
		{
			list: true,
			filterable: true,
		},
	)
	.addUser("author", undefined, {
		list: true,
	});

export default PageCollection;
