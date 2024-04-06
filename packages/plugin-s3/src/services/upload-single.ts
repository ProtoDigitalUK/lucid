import type { S3Client } from "@aws-sdk/client-s3";
import type { PluginOptions } from "../types/types.js";
import type { MediaStrategyUploadSingle } from "@protodigital/headless";

export default (client: S3Client, pluginOptions: PluginOptions) => {
	const uploadSingle: MediaStrategyUploadSingle = async (props) => {
		return {
			success: false,
			message: "",
			response: null,
		};
	};

	return uploadSingle;
};
