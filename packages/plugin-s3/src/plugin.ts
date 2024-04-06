import type { HeadlessPluginOptions } from "@protodigital/headless";
import type { PluginOptions } from "./types/types.js";

/*
    TODO:
    - Update error message handling
*/

const plugin: HeadlessPluginOptions<PluginOptions> = (
	config,
	pluginOptions,
) => {
	config.media = {
		...config.media,
		stategy: {
			stream: () => {},
			uploadSingle: () => {},
			uploadMultiple: () => {},
			updateSingle: () => {},
			deleteSingle: () => {},
			deleteMultiple: () => {},
		},
	};
	return config;
};

export default plugin;
