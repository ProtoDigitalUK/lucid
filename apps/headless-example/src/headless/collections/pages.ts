import { CollectionBuilder } from "@protodigital/headless";
// Bricks
import BannerBrick from "../bricks/banner.js";
import IntroBrick from "../bricks/intro.js";
import TestingBrick from "../bricks/testing.js";
import DefaultMetaBrick from "../bricks/default-meta.js";
import PageMetaBrick from "../bricks/page-meta.js";

const PageCollection = new CollectionBuilder("page", {
	type: "builder",
	multiple: true,
	title: "Pages",
	singular: "Page",
	description: "Pages are used to create static content on your website.",
	bricks: [
		{
			brick: BannerBrick,
			type: "builder",
		},
		{
			brick: IntroBrick,
			type: "builder",
		},
		{
			brick: TestingBrick,
			type: "builder",
		},
		{
			brick: DefaultMetaBrick,
			type: "fixed",
			position: "bottom",
		},
		{
			brick: PageMetaBrick,
			type: "fixed",
			position: "sidebar",
		},
	],
});

export default PageCollection;
