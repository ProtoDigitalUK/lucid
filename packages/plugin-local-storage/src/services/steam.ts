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
					success: false,
					message: T("file_not_found"),
					response: null,
				};
			}

			const body = fs.createReadStream(targetPath);
			const stats = await fs.stat(targetPath);

			const fileExtension = path.extname(targetPath);
			const mimeType = mime.lookup(fileExtension);

			return {
				success: true,
				message: T("file_get_request_successful"),
				response: {
					contentLength: stats.size,
					contentType: mimeType || undefined,
					body: body,
				},
			};
		} catch (e) {
			const error = e as Error;
			return {
				success: false,
				message: error.message,
				response: null,
			};
		}
	};

	return stream;
};
