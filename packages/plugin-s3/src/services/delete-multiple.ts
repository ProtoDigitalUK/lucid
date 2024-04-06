import type { S3Client } from "@aws-sdk/client-s3";
import type { PluginOptions } from "../types/types.js";
import type { MediaStrategyDeleteMultiple } from "@protodigital/headless";

export default (client: S3Client, pluginOptions: PluginOptions) => {
	const deleteMultiple: MediaStrategyDeleteMultiple = async (keys) => {
		return {
			success: false,
			message: "",
			response: null,
		};
	};

	return deleteMultiple;
};
