import T from "../translations/index.js";
import { type S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import type { Readable } from "node:stream";
import type { PluginOptions } from "../types/types.js";
import type { MediaStrategyStream } from "@lucidcms/core/types";

export default (client: S3Client, pluginOptions: PluginOptions) => {
	const stream: MediaStrategyStream = async (key) => {
		try {
			const command = new GetObjectCommand({
				Bucket: pluginOptions.bucket,
				Key: key,
			});

			const response = await client.send(command);

			if (response.Body === undefined) {
				return {
					error: {
						message: T("object_body_undefined"),
					},
					data: undefined,
				};
			}

			return {
				error: undefined,
				data: {
					contentLength: response.ContentLength,
					contentType: response.ContentType,
					body: response.Body as Readable,
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

	return stream;
};
