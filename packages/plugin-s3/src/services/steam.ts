import T from "../translations/index.js";
import { type S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import type { NodeJsClient } from "@smithy/types";
import type { PluginOptions } from "../types/types.js";
import type { MediaStrategyStream } from "@protoheadless/headless";

export default (
	client: NodeJsClient<S3Client>,
	pluginOptions: PluginOptions,
) => {
	const stream: MediaStrategyStream = async (key) => {
		try {
			const command = new GetObjectCommand({
				Bucket: pluginOptions.bucket,
				Key: key,
			});

			const response = await client.send(command);

			if (response.Body === undefined) {
				throw new Error(T("object_body_undefined"));
			}

			return {
				success: true,
				message: T("object_get_request_successful"),
				response: {
					contentLength: response.ContentLength,
					contentType: response.ContentType,
					body: response.Body,
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

	return stream;
};
