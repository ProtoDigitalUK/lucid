import service from "../../utils/app/service.js";
import ProcessedImage from "../../db/models/ProcessedImage.js";
import s3Service from "../s3/index.js";
import mediaService from "../media/index.js";
const clearSingle = async (client, data) => {
    const media = await service(mediaService.getSingle, false, client)({
        id: data.id,
    });
    const processedImages = await ProcessedImage.getAllByMediaKey(client, {
        media_key: media.key,
    });
    if (processedImages.length > 0) {
        await s3Service.deleteObjects({
            objects: processedImages.map((processedImage) => ({
                key: processedImage.key,
            })),
        });
        await ProcessedImage.deleteAllByMediaKey(client, {
            media_key: media.key,
        });
    }
    return;
};
export default clearSingle;
//# sourceMappingURL=clear-single.js.map