import type { PluginOptions, PluginOptionsInternal } from "../types/index.js";

const pluginOptions = (given: PluginOptions): PluginOptionsInternal => {
	return {
		collections: given.collections.map((c) => ({
			key: c.key,
			homepage: c.homepage ?? false,
			slug: {
				prefix: c.slug?.prefix ?? null,
				translations: c.slug?.translations ?? false,
			},
		})),
	};
};

export default pluginOptions;
