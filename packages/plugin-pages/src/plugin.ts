import T from "./translations/index.js";
import type { LucidPluginOptions } from "@lucidcms/core/types";
import type { PluginOptions } from "./types/index.js";
import { PLUGIN_KEY, LUCID_VERSION } from "./constants.js";
import { logger } from "@lucidcms/core";
import { registerFields, pluginOptions } from "./services/index.js";
import {
	beforeUpsertHandler,
	afterUpsertHandler,
} from "./services/hooks/index.js";

/*
    TODO:

    - Add config option to make the slug not required but instead use a text field and slugify it
        - If the slug supported translations, this would need to update the target fiedl to also support translations. It could be a optional as well
    - Apply slug prefix before response 
        - If it were set in the DB instead, if the prefix was edited all slugs would be invalid and need to be updated
        - will need a beforeResponse hook to set the prefix
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
	// TODO: when revision support is added, we will have to run the afterUpsertHandler when a revision is made the active revision to ensure all of its children slugs are correct.

	return {
		key: PLUGIN_KEY,
		lucid: LUCID_VERSION,
		config: config,
	};
};

export default plugin;
