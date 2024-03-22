import { CollectionBuilder } from "@protodigital/headless";
// Bricks
import BannerBrick from "../bricks/banner.js";
import IntroBrick from "../bricks/intro.js";

const BlogCollection = new CollectionBuilder("blog", {
	type: "builder",
	multiple: true,
	title: "Blogs",
	singular: "Blog",
	description: "Manage your blogs.",
	disableHomepages: true,
	disableParents: true,
	bricks: [
		{
			brick: BannerBrick,
			type: "builder",
		},
		{
			brick: IntroBrick,
			type: "builder",
		},
	],
});

export default BlogCollection;
