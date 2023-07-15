// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import Media from "@db/models/Media";
// Format
import formatMedia from "@utils/format/format-media";

export interface ServiceData {
  key: string;
}

const getSingleById = async (data: ServiceData) => {
  const media = await Media.getSingle({
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
