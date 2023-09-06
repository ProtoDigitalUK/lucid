import { S3Client } from "@aws-sdk/client-s3";
import Config from "../../services/Config.js";
const getS3Client = async () => {
    const config = await Config.getConfig();
    const s3Config = {
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
//# sourceMappingURL=s3-client.js.map