import { CollectionBuilder } from "@protodigital/headless";

const SettingsCollection = new CollectionBuilder("settings", {
	type: "builder",
	multiple: false,
	title: "Settings",
	singular: "Setting",
	description: "Set shared settings for your website.",
	bricks: [
		{
			key: "default_meta",
			type: "fixed",
			position: "bottom",
		},
	],
});

export default SettingsCollection;
