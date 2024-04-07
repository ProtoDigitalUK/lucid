import T from "../translations/index.js";
import {
	type S3Client,
	CopyObjectCommand,
	DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import type { NodeJsClient } from "@smithy/types";
import type { PluginOptions } from "../types/types.js";
import type { MediaStrategyUpdateSingle } from "@protodigital/headless";

export default (
	client: NodeJsClient<S3Client>,
	pluginOptions: PluginOptions,
) => {
	const updateSingle: MediaStrategyUpdateSingle = async (props) => {
		try {
			const copyCommand = new CopyObjectCommand({
				Bucket: pluginOptions.bucket,
				CopySource: `${pluginOptions.bucket}/${props.key}`,
				Key: props.newKey,
			});
			await client.send(copyCommand);

			const command = new DeleteObjectCommand({
				Bucket: pluginOptions.bucket,
				Key: props.key,
			});

			await client.send(command);

			return {
				success: true,
				message: T("object_updated_successfully"),
			};
		} catch (e) {
			const error = e as Error;
			return {
				success: false,
				message: error.message,
			};
		}
	};

	return updateSingle;
};
