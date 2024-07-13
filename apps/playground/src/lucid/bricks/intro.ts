import { BrickBuilder } from "@lucidcms/core";

const IntroBrick = new BrickBuilder("intro", {
	title: "Intro",
})
	.addTab("content_tab", {
		labels: {
			title: "Content",
		},
	})
	.addText("title")
	.addWysiwyg("intro");

export default IntroBrick;
