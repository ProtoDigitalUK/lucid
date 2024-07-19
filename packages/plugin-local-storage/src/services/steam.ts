import T from "../translations/index.js";
import fs from "fs-extra";
import path from "node:path";
import mime from "mime-types";
import { keyPaths } from "../utils/helpers.js";
import type { PluginOptions } from "../types/types.js";
import type { MediaStrategyStream } from "@lucidcms/core/types";

export default (pluginOptions: PluginOptions) => {
	const stream: MediaStrategyStream = async (key) => {
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

			const body = fs.createReadStream(targetPath);
			const stats = await fs.stat(targetPath);

			const fileExtension = path.extname(targetPath);
			const mimeType = mime.lookup(fileExtension);

			return {
				error: undefined,
				data: {
					contentLength: stats.size,
					contentType: mimeType || undefined,
					body: body,
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

	return stream;
};
