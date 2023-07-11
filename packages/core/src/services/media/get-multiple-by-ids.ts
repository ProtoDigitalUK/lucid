// Models
import Media from "@db/models/Media";
// Services
import medias from "@services/media";

export interface ServiceData {
  ids: number[];
}

const getMultipleByIds = async (data: ServiceData) => {
  const mediasRes = await Media.getMultipleByIds(data.ids);

  if (!mediasRes) {
    return [];
  }

  return mediasRes.map((media) => medias.format(media));
};

export default getMultipleByIds;
