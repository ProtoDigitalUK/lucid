import ProcessedImage from "../../db/models/ProcessedImage.js";
import s3Service from "../s3/index.js";
const clearAll = async (client) => {
    const processedImages = await ProcessedImage.getAll(client);
    if (processedImages.length > 0) {
        await s3Service.deleteObjects({
            objects: processedImages.map((processedImage) => ({
                key: processedImage.key,
            })),
        });
        await ProcessedImage.deleteAll(client);
    }
    return;
};
export default clearAll;
//# sourceMappingURL=clear-all.js.map