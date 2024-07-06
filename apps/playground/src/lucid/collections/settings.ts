import { z, CollectionBuilder } from "@lucidcms/core";
import SEOBrick from "../bricks/seo.js";

const SettingsCollection = new CollectionBuilder("settings", {
	mode: "single",
	title: "Settings",
	singular: "Setting",
	description: "Set shared settings for your website.",
	bricks: {
		fixed: [SEOBrick],
	},
})
	.addText("site_title", {
		labels: {
			title: "Site Title",
		},
	})
	.addMedia("site_logo", {
		labels: {
			title: "Site Logo",
		},
	})
	.addRepeater("social_links", {
		labels: {
			title: "Social Links",
		},
	})
	.addText("social_name", {
		labels: {
			title: "Name",
		},
		validation: {
			zod: z.string(),
			required: true,
		},
	})
	.addText("social_url", {
		labels: {
			title: "URL",
		},
		validation: {
			zod: z.string().url(),
			required: true,
		},
	})
	.endRepeater();

export default SettingsCollection;
