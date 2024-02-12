import { BrickBuilder } from "@protodigital/headless";

export const TestingBrick = new BrickBuilder("testing", {
	preview: {
		image: "https://usersnap.com/blog/wp-content/uploads/2021/03/7-Common-Types-of-Software-Testing@1x-1280x720.png",
	},
})
	.addTab({
		title: "Content",
		key: "content_tab",
	})
	.addText({
		key: "text-key",
		description: "Testing title",
		placeholder: "Testing title",
	})
	.addWysiwyg({
		key: "wysiwyg-key",
	})
	.addMedia({
		key: "media-key",
		validation: {
			extensions: ["png"],
			type: "image",
		},
	})
	.addRepeater({
		key: "repeater-key",
	})
	.addText({
		key: "repeater-title",
	})
	.addRepeater({
		key: "repeater-key-nested",
	})
	.addText({
		key: "repeater-title-nested",
	})
	.endRepeater()
	.endRepeater()
	.addNumber({
		key: "number-key",
	})
	.addCheckbox({
		key: "checkbox-key",
		copy: {
			true: "Show",
			false: "Hide",
		},
	})
	.addSelect({
		key: "select-key",
		options: [
			{
				label: "Option 1",
				value: "option-1",
			},
			{
				label: "Option 2",
				value: "option-2",
			},
			{
				label: "Option 3",
				value: "option-3",
			},
		],
		validation: {
			required: true,
		},
	})
	.addTextarea({
		key: "textarea-key",
		placeholder: "Testing textarea",
		description: "Testing textarea",
	})
	.addTab({
		title: "Advanced",
		key: "advanced_tab",
	})
	.addJSON({
		key: "json-key",
	})
	.addColour({
		key: "colour-key",
		presets: ["#000000", "#ffffff"],
	})
	.addDateTime({
		key: "datetime-key",
	})
	.addPageLink({
		key: "page-link-key",
	})
	.addLink({
		key: "link-key",
	});

export const BannerBrick = new BrickBuilder("banner", {
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
	.addPageLink({
		key: "page-link",
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

export const IntroBrick = new BrickBuilder("intro", {
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

export const DefaultMetaBrick = new BrickBuilder("default_meta")
	.addText({
		key: "meta_title",
		title: "Meta Title",
	})
	.addTextarea({
		key: "meta_description",
		title: "Meta Description",
	});

export const PageMetaBrick = new BrickBuilder("page_meta")
	.addText({
		key: "meta_title",
		title: "Meta Title",
	})
	.addTextarea({
		key: "meta_description",
		title: "Meta Description",
	});
