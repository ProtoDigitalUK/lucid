import { PoolClient } from "pg";
// Utils
import service from "@utils/app/service.js";
// Models
import Media from "@db/models/Media.js";
// Services
import mediaService from "@services/media/index.js";
import s3Service from "@services/s3/index.js";
// Format
import processedImagesService from "@services/processed-images/index.js";

export interface ServiceData {
  id: number;
}

const deleteSingle = async (client: PoolClient, data: ServiceData) => {
  // Get single by ID
  const media = await service(
    mediaService.getSingle,
    false,
    client
  )({
    id: data.id,
  });

  // Remove all processed images
  await service(
    processedImagesService.clearSingle,
    false,
    client
  )({
    id: media.id,
  });

  // Delete media
  await Media.deleteSingle(client, {
    key: media.key,
  });

  await s3Service.deleteObject({
    key: media.key,
  });

  // update storage used
  await service(
    mediaService.setStorageUsed,
    false,
    client
  )({
    add: 0,
    minus: media.meta.file_size,
  });

  return undefined;
};

export default deleteSingle;
