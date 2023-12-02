import { PoolClient } from "pg";
// Utils
import service from "@utils/app/service.js";
// Services
import optionsService from "@services/options/index.js";
import Config from "@services/Config.js";
// Models
import ProcessedImage from "@db/models/ProcessedImage.js";
// Types
import { SettingsResT } from "@headless/types/src/settings.js";

export interface ServiceData {
  id: number;
}

const getSettings = async (client: PoolClient): Promise<SettingsResT> => {
  const [mediaStorageUsed, processedImagesCount] = await Promise.all([
    service(
      optionsService.getByName,
      false,
      client
    )({
      name: "media_storage_used",
    }),
    ProcessedImage.getAllCount(client),
  ]);

  return {
    media: {
      storage_used: mediaStorageUsed.media_storage_used || null,
      storage_limit: Config.media.storageLimit,
      storage_remaining: mediaStorageUsed.media_storage_used
        ? Config.media.storageLimit - mediaStorageUsed.media_storage_used
        : null,
      processed_images: {
        per_image_limit: Config.media.processedImageLimit,
        total: processedImagesCount,
      },
    },
  };
};

export default getSettings;
