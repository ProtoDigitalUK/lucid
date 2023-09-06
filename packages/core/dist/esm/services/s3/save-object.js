import { PutObjectCommand } from "@aws-sdk/client-s3";
import getS3Client from "../../utils/app/s3-client.js";
import Config from "../Config.js";
const saveObject = async (data) => {
    const S3 = await getS3Client;
    const command = new PutObjectCommand({
        Bucket: Config.media.store.bucket,
        Key: data.key,
        Body: data.type === "file" ? data.file?.data : data.buffer,
        ContentType: data.meta.mimeType,
        Metadata: {
            width: data.meta.width?.toString() || "",
            height: data.meta.height?.toString() || "",
            extension: data.meta.fileExtension,
        },
    });
    return S3.send(command);
};
export default saveObject;
//# sourceMappingURL=save-object.js.map