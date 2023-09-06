import { GetObjectCommand } from "@aws-sdk/client-s3";
import getS3Client from "../../utils/app/s3-client.js";
import { LucidError } from "../../utils/app/error-handler.js";
import Config from "../Config.js";
const getS3Object = async (data) => {
    try {
        const S3 = await getS3Client;
        const command = new GetObjectCommand({
            Bucket: Config.media.store.bucket,
            Key: data.key,
        });
        const res = await S3.send(command);
        return {
            contentLength: res.ContentLength,
            contentType: res.ContentType,
            body: res.Body,
        };
    }
    catch (err) {
        const error = err;
        throw new LucidError({
            type: "basic",
            name: error.name || "Error",
            message: error.message || "An error occurred",
            status: error.message === "The specified key does not exist." ? 404 : 500,
        });
    }
};
export default getS3Object;
//# sourceMappingURL=get-s3-object.js.map