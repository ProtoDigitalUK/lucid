import helpers from "../../utils/media/helpers.js";
import service from "../../utils/app/service.js";
import mediaService from "../media/index.js";
import processedImageService from "../processed-images/index.js";
const streamMedia = async (data) => {
    if (data.query?.format === undefined &&
        data.query?.width === undefined &&
        data.query?.height === undefined) {
        return await mediaService.getS3Object({
            key: data.key,
        });
    }
    const processKey = helpers.createProcessKey({
        key: data.key,
        query: data.query,
    });
    try {
        return await mediaService.getS3Object({
            key: processKey,
        });
    }
    catch (err) {
        return await service(processedImageService.processImage, false)({
            key: data.key,
            processKey: processKey,
            options: data.query,
        });
    }
};
export default streamMedia;
//# sourceMappingURL=stream-media.js.map