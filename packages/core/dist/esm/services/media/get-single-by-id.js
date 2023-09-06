import { LucidError } from "../../utils/app/error-handler.js";
import Media from "../../db/models/Media.js";
import formatMedia from "../../utils/format/format-media.js";
const getSingleById = async (client, data) => {
    const media = await Media.getSingle(client, {
        key: data.key,
    });
    if (!media) {
        throw new LucidError({
            type: "basic",
            name: "Media not found",
            message: "We couldn't find the media you were looking for.",
            status: 404,
        });
    }
    return formatMedia(media);
};
export default getSingleById;
//# sourceMappingURL=get-single-by-id.js.map