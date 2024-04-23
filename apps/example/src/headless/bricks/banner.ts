import { BrickBuilder } from "@protoheadless/core";

const BannerBrick = new BrickBuilder("banner", {
	preview: {
		image: "https://headless-dev.up.railway.app/public/banner-brick.png",
	},
})
	.addTab({
		title: "Content",
		key: "content_tab",
	})
	.addText({
		key: "title",
		description: "The title of the banner",
		validation: {
			required: true,
		},
	})
	.addWysiwyg({
		key: "intro",
	})
	.addRepeater({
		key: "social_links",
		validation: {
			maxGroups: 3,
		},
	})
	.addText({
		key: "social_title",
	})
	.addText({
		key: "social_url",
	})
	.endRepeater()
	.addTab({
		title: "Config",
		key: "config_tab",
	})
	.addCheckbox({
		key: "fullwidth",
		description: "Make the banner fullwidth",
	});

export default BannerBrick;
