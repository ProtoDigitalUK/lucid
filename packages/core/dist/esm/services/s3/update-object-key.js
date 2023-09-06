import { DeleteObjectCommand, CopyObjectCommand } from "@aws-sdk/client-s3";
import getS3Client from "../../utils/app/s3-client.js";
import Config from "../Config.js";
const updateObjectKey = async (data) => {
    const S3 = await getS3Client;
    const copyCommand = new CopyObjectCommand({
        Bucket: Config.media.store.bucket,
        CopySource: `${Config.media.store.bucket}/${data.oldKey}`,
        Key: data.newKey,
    });
    const res = await S3.send(copyCommand);
    const command = new DeleteObjectCommand({
        Bucket: Config.media.store.bucket,
        Key: data.oldKey,
    });
    await S3.send(command);
    return res;
};
export default updateObjectKey;
//# sourceMappingURL=update-object-key.js.map