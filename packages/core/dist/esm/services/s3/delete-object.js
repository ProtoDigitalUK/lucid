import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import getS3Client from "../../utils/app/s3-client.js";
import Config from "../Config.js";
const deleteObject = async (data) => {
    const S3 = await getS3Client;
    const command = new DeleteObjectCommand({
        Bucket: Config.media.store.bucket,
        Key: data.key,
    });
    return S3.send(command);
};
export default deleteObject;
//# sourceMappingURL=delete-object.js.map