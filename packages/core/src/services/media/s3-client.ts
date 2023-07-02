import { S3Client } from "@aws-sdk/client-s3";
// Models
import Config from "@db/models/Config";

const s3Config = Config.media?.s3;

const S3 = new S3Client({
  region: "auto",
  endpoint:
    s3Config?.service === "cloudflare"
      ? `https://${s3Config?.accountId}.r2.cloudflarestorage.com`
      : "",
  credentials: {
    accessKeyId: s3Config?.accessKeyId || "",
    secretAccessKey: s3Config?.secretAccessKey || "",
  },
});

export default S3;
