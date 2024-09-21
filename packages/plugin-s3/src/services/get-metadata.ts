import T from "../translations/index.js";
import { type S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";
import type { PluginOptions } from "../types/types.js";
import type { MediaStrategyGetMeta } from "@lucidcms/core/types";

export default (client: S3Client, pluginOptions: PluginOptions) => {
	const getMetadata: MediaStrategyGetMeta = async (key) => {
		try {
			const command = new HeadObjectCommand({
				Bucket: pluginOptions.bucket,
				Key: key,
			});

			const response = await client.send(command);

			if (response.ContentLength === undefined) {
				return {
					error: {
						message: T("object_missing_metadata"),
					},
					data: undefined,
				};
			}

			return {
				error: undefined,
				data: {
					size: response.ContentLength,
					mimeType: response.ContentType || null,
					etag: response.ETag || null,
				},
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
	return getMetadata;
};
