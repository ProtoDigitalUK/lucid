// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import Media from "@db/models/Media";
// Services
import medias from "@services/media";

export interface ServiceData {
  key: string;
}

const getSingleById = async (data: ServiceData) => {
  const media = await Media.getSingle(data.key);

  if (!media) {
    throw new LucidError({
      type: "basic",
      name: "Media not found",
      message: "We couldn't find the media you were looking for.",
      status: 404,
    });
  }

  return medias.format(media);
};

export default getSingleById;
