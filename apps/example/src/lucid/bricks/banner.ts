import { BrickBuilder } from "@lucidcms/core";

const BannerBrick = new BrickBuilder("banner", {
	description: "A banner with a title and intro text",
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
		description: "The title of the banner. This is displayed as an H1 tag.",
		validation: {
			required: true,
		},
	})
	.addWysiwyg({
		key: "intro",
	})
	.addRepeater({
		key: "call_to_actions",
		title: "Call to Actions",
		validation: {
			maxGroups: 3,
		},
	})
	.addLink({
		key: "link",
		title: "Link",
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
