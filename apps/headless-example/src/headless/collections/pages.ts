import { CollectionBuilder } from "@protodigital/headless";

const PageCollection = new CollectionBuilder("page", {
	type: "builder",
	multiple: true,
	title: "Pages",
	singular: "Page",
	description: "Pages are used to create static content on your website.",
	bricks: [
		{
			key: "banner",
			type: "builder",
		},
		{
			key: "intro",
			type: "builder",
		},
		{
			key: "testing",
			type: "builder",
		},
		{
			key: "default_meta",
			type: "fixed",
			position: "bottom",
		},
		{
			key: "page_meta",
			type: "fixed",
			position: "sidebar",
		},
	],
});

export default PageCollection;
