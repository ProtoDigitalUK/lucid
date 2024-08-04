import T from "./translations/index.js";
import type { LucidPluginOptions } from "@lucidcms/core/types";
import type { PluginOptions } from "./types/index.js";
import { PLUGIN_KEY, LUCID_VERSION } from "./constants.js";
import { logger } from "@lucidcms/core";
import {
	registerFields,
	pluginOptions,
	beforeUpsertHandler,
	afterUpsertHandler,
} from "./services/index.js";

const plugin: LucidPluginOptions<PluginOptions> = async (config, plugin) => {
	const options = pluginOptions(plugin);

	for (const collectionConfig of options.collections) {
		const collectionInstance = config.collections.find(
			(c) => c.key === collectionConfig.key,
		);
		if (!collectionInstance) {
			logger("warn", {
				message: T("cannot_find_collection", {
					collection: collectionConfig.key,
				}),
				scope: PLUGIN_KEY,
			});
			continue;
		}

		registerFields(collectionInstance, collectionConfig);

		if (!collectionInstance.config.hooks) {
			collectionInstance.config.hooks = [];
		}

		collectionInstance.config.hooks.push({
			event: "beforeUpsert",
			handler: beforeUpsertHandler,
		});
		collectionInstance.config.hooks.push({
			event: "afterUpsert",
			handler: afterUpsertHandler,
		});
	}

	return {
		key: PLUGIN_KEY,
		lucid: LUCID_VERSION,
		config: config,
	};
};

export default plugin;
