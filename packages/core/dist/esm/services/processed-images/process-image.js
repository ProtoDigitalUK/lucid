import helpers from "../../utils/media/helpers.js";
import { PassThrough } from "stream";
import mediaService from "../media/index.js";
import s3Service from "../s3/index.js";
import processedImagesService from "../processed-images/index.js";
import ProcessedImage from "../../db/models/ProcessedImage.js";
import useProcessImage from "../../workers/process-image.js";
const saveAndRegister = async (client, data, image) => {
    try {
        await s3Service.saveObject({
            type: "buffer",
            key: data.processKey,
            buffer: image.buffer,
            meta: {
                mimeType: image.mimeType,
                fileExtension: image.extension,
                size: image.size,
                width: image.width,
                height: image.height,
            },
        });
        await ProcessedImage.createSingle(client, {
            key: data.processKey,
            media_key: data.key,
        });
    }
    catch (err) {
    }
};
const processImage = async (client, data) => {
    const s3Response = await mediaService.getS3Object({
        key: data.key,
    });
    if (!s3Response.contentType?.startsWith("image/")) {
        return {
            contentLength: s3Response.contentLength,
            contentType: s3Response.contentType,
            body: s3Response.body,
        };
    }
    try {
        await processedImagesService.getSingleCount(client, {
            key: data.key,
        });
    }
    catch (err) {
        return {
            contentLength: s3Response.contentLength,
            contentType: s3Response.contentType,
            body: s3Response.body,
        };
    }
    const processRes = await useProcessImage({
        buffer: await helpers.streamToBuffer(s3Response.body),
        options: data.options,
    });
    const stream = new PassThrough();
    stream.end(Buffer.from(processRes.buffer));
    saveAndRegister(client, data, processRes);
    return {
        contentLength: processRes.size,
        contentType: processRes.mimeType,
        body: stream,
    };
};
export default processImage;
//# sourceMappingURL=process-image.js.map