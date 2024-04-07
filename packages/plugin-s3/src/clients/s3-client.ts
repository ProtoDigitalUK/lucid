import { S3Client } from "@aws-sdk/client-s3";
import type { NodeJsClient } from "@smithy/types";
import type { PluginOptions } from "../types/types.js";

let s3Client: NodeJsClient<S3Client> | null = null;

const getS3Client = (pluginOptions: PluginOptions) => {
	if (!s3Client) {
		s3Client = new S3Client(
			pluginOptions.clientConfig,
		) as NodeJsClient<S3Client>;
	}

	return s3Client;
};

export default getS3Client;
