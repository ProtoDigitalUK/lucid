import { type S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import type { NodeJsClient } from "@smithy/types";
import type { PluginOptions } from "../types/types.js";
import type { MediaStrategyUpdateSingle } from "@protoheadless/headless";
import uploadSingle from "./upload-single.js";

export default (
	client: NodeJsClient<S3Client>,
	pluginOptions: PluginOptions,
) => {
	const updateSingle: MediaStrategyUpdateSingle = async (oldKey, props) => {
		try {
			const uploadRes = await uploadSingle(client, pluginOptions)(props);

			if (oldKey !== props.key) {
				const command = new DeleteObjectCommand({
					Bucket: pluginOptions.bucket,
					Key: oldKey,
				});

				await client.send(command);
			}

			return uploadRes;
		} catch (e) {
			const error = e as Error;
			return {
				success: false,
				message: error.message,
				response: null,
			};
		}
	};

	return updateSingle;
};
