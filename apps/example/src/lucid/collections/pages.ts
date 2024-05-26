import { CollectionBuilder } from "@lucidcms/core";
import BannerBrick from "../bricks/banner.js";
import IntroBrick from "../bricks/intro.js";
import SEOBrick from "../bricks/seo.js";

const PageCollection = new CollectionBuilder("page", {
	mode: "multiple",
	title: "Pages",
	singular: "Page",
	description: "Manage the pages and content on your website.",
	translations: true,
	hooks: [
		{
			event: "beforeUpsert",
			handler: async (props) => {
				console.log("beforeUpsert hook collection", props.data);
			},
		},
		{
			event: "beforeDelete",
			handler: async (props) => {
				console.log("beforeDelete hook collection", props.data);
			},
		},
		{
			event: "afterDelete",
			handler: async (props) => {
				console.log("afterDelete hook collection", props.data);
			},
		},
	],
	bricks: {
		fixed: [SEOBrick],
		builder: [BannerBrick, IntroBrick],
	},
})
	.addText({
		key: "page_title",
		hidden: false,
		disabled: false,
		collection: {
			list: true,
			filterable: true,
		},
	})
	.addUser({
		key: "author",
		collection: {
			list: true,
		},
	});

export default PageCollection;
