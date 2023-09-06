import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import getS3Client from "../../utils/app/s3-client.js";
import Config from "../Config.js";
const deleteObjects = async (data) => {
    const S3 = await getS3Client;
    const command = new DeleteObjectsCommand({
        Bucket: Config.media.store.bucket,
        Delete: {
            Objects: data.objects.map((object) => ({
                Key: object.key,
            })),
        },
    });
    return S3.send(command);
};
export default deleteObjects;
//# sourceMappingURL=delete-objects.js.map