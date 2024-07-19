import fs from "fs-extra";
import { keyPaths } from "../utils/helpers.js";
import type { PluginOptions } from "../types/types.js";
import type { MediaStrategyDeleteMultiple } from "@lucidcms/core/types";

export default (pluginOptions: PluginOptions) => {
	const deleteMultiple: MediaStrategyDeleteMultiple = async (keys) => {
		try {
			for (const key of keys) {
				const { targetPath } = keyPaths(key, pluginOptions.uploadDir);
				const exists = await fs.pathExists(targetPath);
				if (!exists) continue;
				await fs.unlink(targetPath);
			}

			return {
				error: undefined,
				data: undefined,
			};
		} catch (e) {
			const error = e as Error;
			return {
				error: {
					message: error.message,
				},
				data: undefined,
			};
		}
	};

	return deleteMultiple;
};
