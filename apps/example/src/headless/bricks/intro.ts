import { BrickBuilder } from "@protodigital/headless";

const IntroBrick = new BrickBuilder("intro", {
	preview: {
		image: "https://headless-dev.up.railway.app/public/introduction-brick.png",
	},
})
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
