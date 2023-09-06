import Media from "../../db/models/Media.js";
import formatMedia from "../../utils/format/format-media.js";
const getMultipleByIds = async (client, data) => {
    const mediasRes = await Media.getMultipleByIds(client, {
        ids: data.ids,
    });
    if (!mediasRes) {
        return [];
    }
    return mediasRes.map((media) => formatMedia(media));
};
export default getMultipleByIds;
//# sourceMappingURL=get-multiple-by-ids.js.map