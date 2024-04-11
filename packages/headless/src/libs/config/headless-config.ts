import T from "../../translations/index.js";
import type { Config, HeadlessConfig } from "../../types/config.js";
import checks from "./checks/index.js";
import { ZodError } from "zod";
import ConfigSchema from "./config-schema.js";
import mergeConfig from "./merge-config.js";
import defaultConfig from "./default.js";
import { CollectionConfigSchema } from "../builders/collection-builder/index.js";
import { BrickSchema } from "../builders/brick-builder/index.js";
import { FieldsSchema } from "../builders/field-builder/index.js";
import { HeadlessError } from "../../utils/error-handler.js";
import headlessLogger from "../logging/index.js";

const headlessConfig = async (config: HeadlessConfig) => {
	let configRes = mergeConfig(config, defaultConfig);
	try {
		// merge plugin config
		if (Array.isArray(configRes.plugins)) {
			const postPluginConfig = configRes.plugins.reduce(
				async (acc, plugin) => {
					const configAfterPlugin = await acc;
					return plugin(configAfterPlugin);
				},
				Promise.resolve(configRes),
			);
			configRes = await postPluginConfig;
		}

		// validate config
		configRes = ConfigSchema.parse(configRes) as Config;

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
		if (err instanceof ZodError) {
			for (const error of err.errors) {
				headlessLogger("error", {
					message: error.message,
					scope: "config",
					data: {
						path: error.path.join("."),
					},
				});
			}
		} else if (err instanceof HeadlessError) {
		} else if (err instanceof Error) {
			headlessLogger("error", {
				scope: "config",
				message: err.message,
			});
		} else {
			headlessLogger("error", {
				scope: "config",
				message: T("an_unknown_error_occurred"),
			});
		}

		if (err instanceof HeadlessError && err.kill === false)
			return configRes;
		process.exit(1);
	}
};

export default headlessConfig;
