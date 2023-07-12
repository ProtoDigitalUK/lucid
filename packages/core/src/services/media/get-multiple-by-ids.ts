// Models
import Media from "@db/models/Media";
// Format
import formatMedia from "@utils/format/format-media";

export interface ServiceData {
  ids: number[];
}

const getMultipleByIds = async (data: ServiceData) => {
  const mediasRes = await Media.getMultipleByIds(data.ids);

  if (!mediasRes) {
    return [];
  }

  return mediasRes.map((media) => formatMedia(media));
};

export default getMultipleByIds;
