import T from "../translations/index.js";
import fs from "fs-extra";
import path from "node:path";
import mime from "mime-types";
import type { PluginOptions } from "../types/types.js";
import type { MediaStrategyStream } from "@protodigital/headless";

export default (pluginOptions: PluginOptions) => {
	const stream: MediaStrategyStream = async (key) => {
		try {
			const uploadDir = path.join(pluginOptions.uploadDir, key);

			const exists = await fs.pathExists(uploadDir);
			if (!exists) {
				return {
					success: false,
					message: T("file_not_found"),
					response: null,
				};
			}

			const body = fs.createReadStream(uploadDir);
			const stats = await fs.stat(uploadDir);

			const fileExtension = path.extname(uploadDir);
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
