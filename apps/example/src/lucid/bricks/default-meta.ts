import { BrickBuilder } from "@lucidcms/core";

const DefaultMetaBrick = new BrickBuilder("default_meta")
	.addText({
		key: "meta_title",
		title: "Meta Title",
	})
	.addTextarea({
		key: "meta_description",
		title: "Meta Description",
	});

export default DefaultMetaBrick;
