import { CollectionBuilder } from "@lucidcms/core";

const BlogCollection = new CollectionBuilder("blog", {
	mode: "multiple",
	title: "Blogs",
	singular: "Blog",
	description: "Manage your blogs.",
	translations: true,
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
	.addTextarea({
		key: "page_excerpt",
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
	})
	.addWysiwyg({
		key: "content",
	});

export default BlogCollection;
