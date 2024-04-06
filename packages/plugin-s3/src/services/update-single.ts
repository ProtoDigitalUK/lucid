import type { S3Client } from "@aws-sdk/client-s3";
import type { PluginOptions } from "../types/types.js";
import type { MediaStrategyUpdateSingle } from "@protodigital/headless";

export default (client: S3Client, pluginOptions: PluginOptions) => {
	const updateSingle: MediaStrategyUpdateSingle = async (props) => {
		return {
			success: false,
			message: "",
		};
	};

	return updateSingle;
};
