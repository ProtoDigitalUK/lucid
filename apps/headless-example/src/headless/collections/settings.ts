import { CollectionBuilder } from "@protodigital/headless";
// Bricks
import DefaultMetaBrick from "../bricks/default-meta.js";

const SettingsCollection = new CollectionBuilder("settings", {
	type: "builder",
	multiple: false,
	title: "Settings",
	singular: "Setting",
	description: "Set shared settings for your website.",
	bricks: [
		{
			brick: DefaultMetaBrick,
			type: "fixed",
			position: "bottom",
		},
	],
});

export default SettingsCollection;
