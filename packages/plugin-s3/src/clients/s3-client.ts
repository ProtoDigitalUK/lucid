import { S3Client } from "@aws-sdk/client-s3";
import type { PluginOptions } from "../types/types.js";

let s3Client: S3Client | null = null;

const getS3Client = (pluginOptions: PluginOptions) => {
	if (!s3Client) {
		s3Client = new S3Client(pluginOptions.clientConfig);
	}

	return s3Client;
};

export default getS3Client;
