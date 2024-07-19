import { type S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import type { NodeJsClient } from "@smithy/types";
import type { PluginOptions } from "../types/types.js";
import type { MediaStrategyUploadSingle } from "@lucidcms/core/types";

export default (
	client: NodeJsClient<S3Client>,
	pluginOptions: PluginOptions,
) => {
	const uploadSingle: MediaStrategyUploadSingle = async (props) => {
		try {
			const command = new PutObjectCommand({
				Bucket: pluginOptions.bucket,
				Key: props.key,
				Body: props.data,
				ContentType: props.meta.mimeType,
				Metadata: {
					width: props.meta.width?.toString() || "",
					height: props.meta.height?.toString() || "",
					extension: props.meta.extension || "",
				},
			});

			const response = await client.send(command);

			return {
				error: undefined,
				data: {
					etag: response.ETag?.replace(/"/g, ""),
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

	return uploadSingle;
};
