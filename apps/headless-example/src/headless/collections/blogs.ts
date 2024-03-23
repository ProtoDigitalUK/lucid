import { CollectionBuilder } from "@protodigital/headless";
// Bricks
import BannerBrick from "../bricks/banner.js";
import IntroBrick from "../bricks/intro.js";

const BlogCollection = new CollectionBuilder("blog", {
	multiple: true,
	title: "Blogs",
	singular: "Blog",
	description: "Manage your blogs.",
	enableSlugs: true,
	builderBricks: [BannerBrick, IntroBrick],
});

export default BlogCollection;
