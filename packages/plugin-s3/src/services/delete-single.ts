import T from "../translations/index.js";
import { type S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import type { NodeJsClient } from "@smithy/types";
import type { PluginOptions } from "../types/types.js";
import type { MediaStrategyDeleteSingle } from "@lucidcms/core/types";

export default (
	client: NodeJsClient<S3Client>,
	pluginOptions: PluginOptions,
) => {
	const deletSingle: MediaStrategyDeleteSingle = async (key) => {
		try {
			const command = new DeleteObjectCommand({
				Bucket: pluginOptions.bucket,
				Key: key,
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

	return deletSingle;
};
