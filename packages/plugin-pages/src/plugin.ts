import T from "./translations/index.js";
import type { LucidPluginOptions } from "@lucidcms/core/types";
import type { PluginOptions } from "./types/index.js";
import { PLUGIN_KEY, LUCID_VERSION } from "./constants.js";
import { logger } from "@lucidcms/core";
import { registerFields, pluginOptions } from "./services/index.js";
import {
	beforeUpsertHandler,
	afterUpsertHandler,
	beforeDeleteHandler,
} from "./services/hooks/index.js";

/*
    TODO:
    - [] test how what we have currently works with translations disabled. With 1 locale (with and without translations on) and also with locale added when documents already exist (update a child’s translation for new locale - see what breaks? Default to default locale?)
    - [] add new slug use field feature so if the slug is empty it will use a slugified version of a given collection text field - if the slug has a value ignore this.
*/

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
	}

	config.hooks.push({
		service: "collection-documents",
		event: "beforeUpsert",
		handler: beforeUpsertHandler(options),
	});
	config.hooks.push({
		service: "collection-documents",
		event: "afterUpsert",
		handler: afterUpsertHandler(options),
	});
	config.hooks.push({
		service: "collection-documents",
		event: "beforeDelete",
		handler: beforeDeleteHandler(options),
	});

	// TODO: when revision support is added, we will have to run the afterUpsertHandler when a revision is made the active revision to ensure all of its children slugs are correct.

	return {
		key: PLUGIN_KEY,
		lucid: LUCID_VERSION,
		config: config,
	};
};

export default plugin;
