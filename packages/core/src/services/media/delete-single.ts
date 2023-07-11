// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import Media from "@db/models/Media";
// Services
import mediaService from "@services/media";
import s3Service from "@services/s3";

export interface ServiceData {
  key: string;
}

const deleteSingle = async (data: ServiceData) => {
  const media = await Media.deleteSingle(data.key);

  if (!media) {
    throw new LucidError({
      type: "basic",
      name: "Media not found",
      message: "Media not found",
      status: 404,
    });
  }

  await s3Service.deleteFile({
    key: media.key,
  });
  // update storage used
  await mediaService.setStorageUsed({
    add: 0,
    minus: media.file_size,
  });

  return mediaService.format(media);
};

export default deleteSingle;
