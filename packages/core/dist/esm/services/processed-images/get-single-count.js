import { LucidError } from "../../utils/app/error-handler.js";
import ProcessedImage from "../../db/models/ProcessedImage.js";
import Config from "../Config.js";
const getSingleCount = async (client, data) => {
    const limit = Config.media.processedImageLimit;
    const count = await ProcessedImage.getAllByMediaKeyCount(client, {
        media_key: data.key,
    });
    if (count >= limit) {
        throw new LucidError({
            type: "basic",
            name: "Processed image limit reached",
            message: `The processed image limit of ${limit} has been reached for this image.`,
            status: 400,
        });
    }
    return count;
};
export default getSingleCount;
//# sourceMappingURL=get-single-count.js.map