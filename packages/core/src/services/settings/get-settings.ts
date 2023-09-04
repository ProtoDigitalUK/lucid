import { PoolClient } from "pg";
// Utils
import service from "@utils/app/service";
// Services
import optionsService from "@services/options";
import Config from "@services/Config";
// Models
import ProcessedImage from "@db/models/ProcessedImage";
// Types
import { SettingsResT } from "@lucid/types/src/settings";

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
