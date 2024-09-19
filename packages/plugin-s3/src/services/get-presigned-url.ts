import { type S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PRESIGNED_URL_EXPIRY } from "../constants.js";
import type { PluginOptions } from "../types/types.js";
import type { MediaStrategyGetPresignedUrl } from "@lucidcms/core/types";

export default (client: S3Client, pluginOptions: PluginOptions) => {
	const getPresignedUrl: MediaStrategyGetPresignedUrl = async (key, meta) => {
		try {
			const command = new PutObjectCommand({
				Bucket: pluginOptions.bucket,
				Key: key,
				ContentType: meta.mimeType,
				Metadata: {
					extension: meta.extension || "",
				},
			});

			const response = await getSignedUrl(client, command, {
				expiresIn: PRESIGNED_URL_EXPIRY,
			});

			return {
				error: undefined,
				data: {
					url: response,
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

	return getPresignedUrl;
};
