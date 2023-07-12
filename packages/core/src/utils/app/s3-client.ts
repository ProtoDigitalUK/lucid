import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
// Services
import Config from "@services/Config";

const getS3Client = async () => {
  const config = await Config.getConfig();

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

  return new S3Client(s3Config);
};

export default getS3Client();
