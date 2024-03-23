import { S3Client, type S3ClientConfig } from "@aws-sdk/client-s3";
import getConfig from "../libs/config/get-config.js";

let s3Client: S3Client | null = null;

const getS3Client = async () => {
	if (!s3Client) {
		const config = await getConfig();

		const s3Config: S3ClientConfig = {
			region: config.media.store.region,
			credentials: {
				accessKeyId: config.media.store.accessKeyId,
				secretAccessKey: config.media.store.secretAccessKey,
			},
		};

		if (config.media.store.service === "cloudflare") {
			s3Config.endpoint = `https://${config.media.store.cloudflareAccountId}.r2.cloudflarestorage.com`;
		}

		s3Client = new S3Client(s3Config);
	}

	return s3Client;
};

export default getS3Client();
