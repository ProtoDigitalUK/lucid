import { BrickBuilder } from "@lucidcms/core";

const IntroBrick = new BrickBuilder("intro")
	.addTab("content_tab", {
		labels: {
			title: "Content",
		},
	})
	.addText("title")
	.addWysiwyg("intro");

export default IntroBrick;
