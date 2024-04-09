import { CollectionBuilder } from "@protoheadless/headless";
// Bricks
import BannerBrick from "../bricks/banner.js";
import IntroBrick from "../bricks/intro.js";

const BlogCollection = new CollectionBuilder("blog", {
	mode: "multiple",
	title: "Blogs",
	singular: "Blog",
	description: "Manage your blogs.",
	bricks: {
		builder: [BannerBrick, IntroBrick],
	},
})
	.addText({
		key: "page_title",
	})
	.addTextarea({
		key: "page_excerpt",
	});

export default BlogCollection;
