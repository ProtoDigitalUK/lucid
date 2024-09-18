import crypto from "node:crypto";
import type { PluginOptions } from "../types/types.js";
import type { MediaStrategySignUrl } from "@lucidcms/core/types";

export default (pluginOptions: PluginOptions) => {
	const signUrl: MediaStrategySignUrl = async (key, meta) => {
		try {
			const timestamp = Date.now();
			const token = crypto
				.createHmac("sha256", pluginOptions.secretKey)
				.update(`${key}${timestamp}`)
				.digest("hex");

			return {
				error: undefined,
				data: `${meta.host}/api/v1/localstorage/upload/${key}?token=${token}&timestamp=${timestamp}`,
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

	return signUrl;
};
