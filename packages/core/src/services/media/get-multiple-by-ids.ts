// Models
import Media from "@db/models/Media";
// Services
import mediaService from "@services/media";

export interface ServiceData {
  ids: number[];
}

const getMultipleByIds = async (data: ServiceData) => {
  const mediasRes = await Media.getMultipleByIds(data.ids);

  if (!mediasRes) {
    return [];
  }

  return mediasRes.map((media) => mediaService.format(media));
};

export default getMultipleByIds;
