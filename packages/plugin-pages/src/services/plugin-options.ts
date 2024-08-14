import type { PluginOptions, PluginOptionsInternal } from "../types/index.js";

const pluginOptions = (given: PluginOptions): PluginOptionsInternal => {
	return {
		collections: given.collections.map((c) => ({
			collectionKey: c.collectionKey,
			enableTranslations: c?.enableTranslations ?? false,
			displayFullSlug: c?.displayFullSlug ?? false,
			// fallbackSlugSource: c?.fallbackSlugSource ?? undefined,
		})),
	};
};

export default pluginOptions;
