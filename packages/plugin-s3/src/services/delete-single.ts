import type { S3Client } from "@aws-sdk/client-s3";
import type { PluginOptions } from "../types/types.js";
import type { MediaStrategyDeleteSingle } from "@protodigital/headless";

export default (client: S3Client, pluginOptions: PluginOptions) => {
	const deletSingle: MediaStrategyDeleteSingle = async (key) => {
		return {
			success: false,
			message: "",
		};
	};

	return deletSingle;
};
