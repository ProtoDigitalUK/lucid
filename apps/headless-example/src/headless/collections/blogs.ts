import { CollectionBuilder } from "@protodigital/headless";

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
			key: "banner",
			type: "builder",
		},
		{
			key: "intro",
			type: "builder",
		},
	],
});

export default BlogCollection;
