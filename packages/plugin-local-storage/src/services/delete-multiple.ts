import T from "../translations/index.js";
import fs from "fs-extra";
import { keyPaths } from "../utils/helpers.js";
import type { PluginOptions } from "../types/types.js";
import type { MediaStrategyDeleteMultiple } from "@protoheadless/core/types";

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
				success: true,
				message: T("file_deleted_successfully_multiple"),
			};
		} catch (e) {
			const error = e as Error;
			return {
				success: false,
				message: error.message,
			};
		}
	};

	return deleteMultiple;
};
