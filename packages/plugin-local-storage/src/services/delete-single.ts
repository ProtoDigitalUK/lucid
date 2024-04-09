import T from "../translations/index.js";
import fs from "fs-extra";
import { keyPaths } from "../utils/helpers.js";
import type { PluginOptions } from "../types/types.js";
import type { MediaStrategyDeleteSingle } from "@protoheadless/headless";

export default (pluginOptions: PluginOptions) => {
	const deletSingle: MediaStrategyDeleteSingle = async (key) => {
		try {
			const { targetPath } = keyPaths(key, pluginOptions.uploadDir);

			const exists = await fs.pathExists(targetPath);
			if (!exists) {
				return {
					success: false,
					message: T("file_not_found"),
				};
			}

			await fs.unlink(targetPath);

			return {
				success: true,
				message: T("file_deleted_successfully_single"),
			};
		} catch (e) {
			const error = e as Error;
			return {
				success: false,
				message: error.message,
			};
		}
	};

	return deletSingle;
};
