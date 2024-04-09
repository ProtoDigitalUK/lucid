import T from "../translations/index.js";
import { type S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import type { NodeJsClient } from "@smithy/types";
import type { PluginOptions } from "../types/types.js";
import type { MediaStrategyDeleteSingle } from "@protoheadless/headless";

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
				success: true,
				message: T("object_deleted_successfully_single"),
			};
		} catch (e) {
			const error = e as Error;
			return {
				success: false,
				message: error.message,
			};
		}
	};

	return deletSingle;
};
