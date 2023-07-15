import { PoolClient } from "pg";
// Utils
import { LucidError } from "@utils/app/error-handler";
import service from "@utils/app/service";
// Models
import Media from "@db/models/Media";
// Services
import mediaService from "@services/media";
import s3Service from "@services/s3";
// Format
import formatMedia from "@utils/format/format-media";

export interface ServiceData {
  key: string;
}

const deleteSingle = async (client: PoolClient, data: ServiceData) => {
  const media = await Media.deleteSingle(client, {
    key: data.key,
  });

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
  await service(
    mediaService.setStorageUsed,
    false,
    client
  )({
    add: 0,
    minus: media.file_size,
  });

  return formatMedia(media);
};

export default deleteSingle;
