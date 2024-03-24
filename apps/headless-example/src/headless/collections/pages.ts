import { CollectionBuilder } from "@protodigital/headless";
// Bricks
import BannerBrick from "../bricks/banner.js";
import IntroBrick from "../bricks/intro.js";
import TestingBrick from "../bricks/testing.js";
import DefaultMetaBrick from "../bricks/default-meta.js";
import PageMetaBrick from "../bricks/page-meta.js";

const PageCollection = new CollectionBuilder("page", {
	multiple: true,
	title: "Pages",
	singular: "Page",
	description: "Pages are used to create static content on your website.",
	builderBricks: [BannerBrick, IntroBrick, TestingBrick],
	fixedBricks: [DefaultMetaBrick, PageMetaBrick],
})
	.enableHomepages()
	.enableSlugs()
	.enableParents()
	.enableTranslations()
	.enableCategories()
	.addText({
		key: "page_title",
	})
	.addTextarea({
		key: "page_excerpt",
	});

export default PageCollection;
