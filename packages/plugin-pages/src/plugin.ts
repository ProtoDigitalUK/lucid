import type { LucidPluginOptions } from "@lucidcms/core/types";
import type { PluginOptions } from "./types/index.js";
import { PLUGIN_KEY, LUCID_VERSION } from "./constants.js";

const plugin: LucidPluginOptions<PluginOptions> = async (
	config,
	pluginOptions,
) => {
	return {
		key: PLUGIN_KEY,
		lucid: LUCID_VERSION,
		config: config,
	};
};

export default plugin;
