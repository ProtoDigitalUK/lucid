import T from "../translations/index.js";
import { type S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import type { NodeJsClient } from "@smithy/types";
import type { PluginOptions } from "../types/types.js";
import type { MediaStrategyUploadSingle } from "@protoheadless/core/types";

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
					extension: props.meta.fileExtension,
				},
			});

			const response = await client.send(command);

			return {
				success: true,
				message: T("object_saved_successfully"),
				response: {
					etag: response.ETag?.replace(/"/g, ""),
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

	return uploadSingle;
};
