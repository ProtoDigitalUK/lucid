import T from "../translations/index.js";
import { type S3Client, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import type { NodeJsClient } from "@smithy/types";
import type { PluginOptions } from "../types/types.js";
import type { MediaStrategyDeleteMultiple } from "@protoheadless/headless/types";

export default (
	client: NodeJsClient<S3Client>,
	pluginOptions: PluginOptions,
) => {
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
				success: true,
				message: T("object_deleted_successfully_multiple"),
			};
		} catch (e) {
			const error = e as Error;
			return {
				success: false,
				message: error.message,
			};
		}
	};

	return deleteMultiple;
};
