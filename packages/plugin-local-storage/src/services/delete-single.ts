import T from "../translations/index.js";
import fs from "fs-extra";
import { keyPaths } from "../utils/helpers.js";
import type { PluginOptions } from "../types/types.js";
import type { MediaStrategyDeleteSingle } from "@lucidcms/core/types";

export default (pluginOptions: PluginOptions) => {
	const deletSingle: MediaStrategyDeleteSingle = async (key) => {
		try {
			const { targetPath } = keyPaths(key, pluginOptions.uploadDir);

			const exists = await fs.pathExists(targetPath);
			if (!exists) {
				return {
					error: {
						message: T("file_not_found"),
					},
					data: undefined,
				};
			}

			await fs.unlink(targetPath);

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

	return deletSingle;
};
