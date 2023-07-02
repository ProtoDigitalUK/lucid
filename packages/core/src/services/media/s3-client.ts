import { S3Client } from "@aws-sdk/client-s3";
// Models
import Config from "@db/models/Config";

const storeConfig = Config.media.store;

const S3 = new S3Client({
  region: storeConfig.region,
  endpoint:
    storeConfig.service === "cloudflare"
      ? `https://${storeConfig.cloudflareAccountId}.r2.cloudflarestorage.com`
      : undefined,
  credentials: {
    accessKeyId: storeConfig.accessKeyId,
    secretAccessKey: storeConfig.secretAccessKey,
  },
});

export default S3;
