import { BrickBuilder } from "@lucidcms/core";

const IntroBrick = new BrickBuilder("intro")
	.addTab({
		title: "Content",
		key: "content_tab",
	})
	.addText({
		key: "title",
	})
	.addWysiwyg({
		key: "intro",
	});

export default IntroBrick;
