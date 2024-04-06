import type { S3Client } from "@aws-sdk/client-s3";
import type { PluginOptions } from "../types/types.js";
import type { MediaStrategyStream } from "@protodigital/headless";

export default (client: S3Client, pluginOptions: PluginOptions) => {
	const stream: MediaStrategyStream = async (key) => {
		return {
			success: false,
			message: "",
			response: null,
		};
	};

	return stream;
};
