import T from "../translations/index.js";
import crypto from "node:crypto";
import { keyPaths } from "../utils/helpers.js";
import fs from "fs-extra";
import mime from "mime-types";
import type { PluginOptions } from "../types/types.js";
import type { MediaStrategyGetMeta } from "@lucidcms/core/types";

export default (pluginOptions: PluginOptions) => {
	const getMetadata: MediaStrategyGetMeta = async (key) => {
		try {
			const { targetPath } = keyPaths(key, pluginOptions.uploadDir);
			const exists = await fs.pathExists(targetPath);

			if (!exists) {
				return {
					error: {
						message: T("file_not_found"),
						status: 404,
					},
					data: undefined,
				};
			}

			const stats = await fs.stat(targetPath);
			const mimeType = mime.lookup(targetPath) || null;

			const etag = crypto
				.createHash("md5")
				.update(`${stats.mtime.getTime()}-${stats.size}`)
				.digest("hex");

			return {
				error: undefined,
				data: {
					size: stats.size,
					mimeType: mimeType,
					etag: etag,
				},
			};
		} catch (e) {
			const error = e as Error;
			return {
				error: {
					message: error.message,
					status: 500,
				},
				data: undefined,
			};
		}
	};

	return getMetadata;
};
