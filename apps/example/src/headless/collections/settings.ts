import { CollectionBuilder } from "@protoheadless/core";
// Bricks
import DefaultMetaBrick from "../bricks/default-meta.js";

const SettingsCollection = new CollectionBuilder("settings", {
	mode: "single",
	title: "Settings",
	singular: "Setting",
	description: "Set shared settings for your website.",
	bricks: {
		fixed: [DefaultMetaBrick],
	},
}).addText({
	key: "site_title",
	title: "Site Title",
});

export default SettingsCollection;
