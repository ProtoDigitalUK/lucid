import { type S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import type { PluginOptions } from "../types/types.js";
import type { MediaStrategyUpdateSingle } from "@lucidcms/core/types";
import uploadSingle from "./upload-single.js";

export default (client: S3Client, pluginOptions: PluginOptions) => {
	const updateSingle: MediaStrategyUpdateSingle = async (oldKey, props) => {
		try {
			const uploadRes = await uploadSingle(client, pluginOptions)(props);
			if (uploadRes.error) return uploadRes;

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
				error: {
					message: error.message,
				},
				data: undefined,
			};
		}
	};

	return updateSingle;
};
