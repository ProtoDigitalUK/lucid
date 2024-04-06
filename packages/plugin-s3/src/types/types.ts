import type { S3ClientConfig } from "@aws-sdk/client-s3";

export interface PluginOptions {
	clientConfig: S3ClientConfig;
	bucket: string;
}
