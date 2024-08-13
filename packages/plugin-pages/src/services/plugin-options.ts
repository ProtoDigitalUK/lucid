import type { PluginOptions, PluginOptionsInternal } from "../types/index.js";

const pluginOptions = (given: PluginOptions): PluginOptionsInternal => {
	return {
		collections: given.collections.map((c) => ({
			key: c.key,
			translations: c?.translations ?? false,
			showFullSlug: c?.showFullSlug ?? false,
		})),
	};
};

export default pluginOptions;
