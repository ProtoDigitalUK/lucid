import { CollectionBuilder } from "@lucidcms/core";
import z from "zod";
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
	.addText({
		key: "site_title",
		title: "Site Title",
	})
	.addMedia({
		key: "site_logo",
		title: "Site Logo",
	})
	.addRepeater({
		key: "social_links",
		title: "Social Links",
	})
	.addText({
		key: "social_name",
		title: "Name",
		validation: {
			zod: z.string(),
			required: true,
		},
	})
	.addText({
		key: "social_url",
		title: "URL",
		validation: {
			zod: z.string().url(),
			required: true,
		},
	})
	.endRepeater();

export default SettingsCollection;
