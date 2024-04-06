import { ZodError } from "zod";
import { log } from "console-log-colors";
import checks from "./checks/index.js";
import ConfigSchema from "./config-schema.js";
import { CollectionConfigSchema } from "../builders/collection-builder/index.js";
import { BrickSchema } from "../builders/brick-builder/index.js";
import { FieldsSchema } from "../builders/field-builder/index.js";
import type { Config } from "../../types/config.js";

const headlessConfig = (config: Config) => {
	try {
		const configRes = ConfigSchema.parse(config) as Config;

		// TODO: Add a merge with default

		// TODO: add solution for handling errors thrown within plugins, provide callback or something?
		// Merge plugin config
		if (Array.isArray(config.plugins)) {
			const postPluginConfig = config.plugins?.reduce((acc, plugin) => {
				const configAfterPlugin = acc;
				return plugin(configAfterPlugin);
			}, config);

			return postPluginConfig;
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
		log.white("-".repeat(60));
		log.yellow("Headless Config Error");
		log.white("-".repeat(60));

		if (err instanceof ZodError) {
			console.table(
				err.errors.map((error) => {
					return {
						path: error.path.join("."),
						message: error.message,
					};
				}),
			);
		} else if (err instanceof Error) {
			log.red(err.message);
		} else {
			log.red("An unexpected error occurred");
		}

		log.white("-".repeat(60));

		process.exit(1);
	}
};

export default headlessConfig;
