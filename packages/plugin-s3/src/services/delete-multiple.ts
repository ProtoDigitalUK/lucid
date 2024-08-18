import { type S3Client, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import type { PluginOptions } from "../types/types.js";
import type { MediaStrategyDeleteMultiple } from "@lucidcms/core/types";

export default (client: S3Client, pluginOptions: PluginOptions) => {
	const deleteMultiple: MediaStrategyDeleteMultiple = async (keys) => {
		try {
			const command = new DeleteObjectsCommand({
				Bucket: pluginOptions.bucket,
				Delete: {
					Objects: keys.map((k) => ({
						Key: k,
					})),
				},
			});

			await client.send(command);

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
