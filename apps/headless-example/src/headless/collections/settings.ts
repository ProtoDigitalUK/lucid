import { CollectionBuilder } from "@protodigital/headless";
// Bricks
import DefaultMetaBrick from "../bricks/default-meta.js";

const SettingsCollection = new CollectionBuilder("settings", {
	multiple: false,
	title: "Settings",
	singular: "Setting",
	description: "Set shared settings for your website.",
	fixedBricks: [DefaultMetaBrick],
});

export default SettingsCollection;
