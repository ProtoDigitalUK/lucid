import service from "../../utils/app/service.js";
import Media from "../../db/models/Media.js";
import mediaService from "../media/index.js";
import s3Service from "../s3/index.js";
import processedImagesService from "../processed-images/index.js";
const deleteSingle = async (client, data) => {
    const media = await service(mediaService.getSingle, false, client)({
        id: data.id,
    });
    await service(processedImagesService.clearSingle, false, client)({
        id: media.id,
    });
    await Media.deleteSingle(client, {
        key: media.key,
    });
    await s3Service.deleteObject({
        key: media.key,
    });
    await service(mediaService.setStorageUsed, false, client)({
        add: 0,
        minus: media.meta.file_size,
    });
    return undefined;
};
export default deleteSingle;
//# sourceMappingURL=delete-single.js.map