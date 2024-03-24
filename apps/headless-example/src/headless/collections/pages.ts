import { CollectionBuilder } from "@protodigital/headless";
// Bricks
import BannerBrick from "../bricks/banner.js";
import IntroBrick from "../bricks/intro.js";
import TestingBrick from "../bricks/testing.js";
import DefaultMetaBrick from "../bricks/default-meta.js";
import PageMetaBrick from "../bricks/page-meta.js";

const PageCollection = new CollectionBuilder("page", {
	mode: "multiple",
	title: "Pages",
	singular: "Page",
	description: "Pages are used to create static content on your website.",
	config: {
		enableParents: true,
		enableHomepages: true,
		enableSlugs: true,
		enableCategories: true,
		enableTranslations: true,
	},
	bricks: {
		fixed: [DefaultMetaBrick, PageMetaBrick],
		builder: [BannerBrick, IntroBrick, TestingBrick],
	},
})
	.addText({
		key: "page_title",
	})
	.addTextarea({
		key: "page_excerpt",
	});

export default PageCollection;
