import { PoolClient } from "pg";
// Utils
import service from "@utils/app/service.js";
// Models
import Media from "@db/models/Media.js";
// Services
import mediaService from "@services/media/index.js";
import s3Service from "@services/s3/index.js";
import translationsService from "@services/translations/index.js";
// Format
import processedImagesService from "@services/processed-images/index.js";

export interface ServiceData {
  id: number;
}

const deleteSingle = async (client: PoolClient, data: ServiceData) => {
  const media = await service(
    mediaService.getSingle,
    false,
    client
  )({
    id: data.id,
  });

  // Remove all processed images
  await Promise.all([
    service(
      processedImagesService.clearSingle,
      false,
      client
    )({
      id: media.id,
    }),
    Media.deleteSingle(client, {
      key: media.key,
    }),
    s3Service.deleteObject({
      key: media.key,
    }),
    service(
      mediaService.setStorageUsed,
      false,
      client
    )({
      add: 0,
      minus: media.meta.file_size,
    }),
    service(
      translationsService.deleteMultiple,
      false,
      client
    )({
      translation_key_ids: [
        media.name_translation_key_id,
        media.alt_translation_key_id,
      ],
    }),
  ]);

  return undefined;
};

export default deleteSingle;
