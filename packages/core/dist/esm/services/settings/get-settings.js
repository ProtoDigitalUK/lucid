import service from "../../utils/app/service.js";
import optionsService from "../options/index.js";
import Config from "../Config.js";
import ProcessedImage from "../../db/models/ProcessedImage.js";
const getSettings = async (client) => {
    const [mediaStorageUsed, processedImagesCount] = await Promise.all([
        service(optionsService.getByName, false, client)({
            name: "media_storage_used",
        }),
        ProcessedImage.getAllCount(client),
    ]);
    return {
        media: {
            storage_used: mediaStorageUsed.media_storage_used || null,
            storage_limit: Config.media.storageLimit,
            storage_remaining: mediaStorageUsed.media_storage_used
                ? Config.media.storageLimit - mediaStorageUsed.media_storage_used
                : null,
            processed_images: {
                per_image_limit: Config.media.processedImageLimit,
                total: processedImagesCount,
            },
        },
    };
};
export default getSettings;
//# sourceMappingURL=get-settings.js.map