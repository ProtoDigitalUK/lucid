import checks from "./checks/index.js";
import ConfigSchema from "./config-schema.js";
import { CollectionConfigSchema } from "../builders/collection-builder/index.js";
import { BrickSchema } from "../builders/brick-builder/index.js";
import { FieldsSchema } from "../builders/field-builder/index.js";
import type { Config } from "../../types/config.js";
import { errorLogger, HeadlessError } from "../../utils/error-handler.js";

const headlessConfig = async (config: Config) => {
	let configRes = config;
	try {
		configRes = ConfigSchema.parse(config) as Config;

		// TODO: Add a merge with default

		// Merge plugin config

		if (Array.isArray(config.plugins)) {
			const postPluginConfig = config.plugins.reduce(
				async (acc, plugin) => {
					const configAfterPlugin = await acc;
					return plugin(configAfterPlugin);
				},
				Promise.resolve(config),
			);

			configRes = await postPluginConfig;
		}

		// checks.checkDuplicateBuilderKeys(
		// 	"bricks",
		// 	config.bricks?.map((b) => b.key),
		// );
		checks.checkDuplicateBuilderKeys(
			"collections",
			config.collections?.map((c) => c.data.key),
		);

		// TODO: return to brick validation now bricks only exist as part of collections
		if (configRes.collections) {
			for (const collection of configRes.collections) {
				CollectionConfigSchema.parse(collection.config);

				for (const brick of [
					...(collection.config.bricks?.fixed || []),
					...(collection.config.bricks?.builder || []),
				]) {
					BrickSchema.parse(brick.config);
					for (const field of brick.flatFields)
						FieldsSchema.parse(field);
					checks.checkDuplicateFieldKeys(
						brick.key,
						brick.meta.fieldKeys,
					);
					checks.checkRepeaterDepth(
						brick.key,
						brick.meta.repeaterDepth,
					);
				}
			}
		}

		return configRes;
	} catch (err) {
		errorLogger("Config Error", err as Error);

		if (err instanceof HeadlessError) {
			if (err.hard === true) {
				process.exit(1);
			} else return configRes;
		}

		process.exit(1);
	}
};

export default headlessConfig;
