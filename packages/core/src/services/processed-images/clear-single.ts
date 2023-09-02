import { PoolClient } from "pg";
// Utils
import service from "@utils/app/service";
// Models
import ProcessedImage from "@db/models/ProcessedImage";
// Services
import s3Service from "@services/s3";
import mediaService from "@services/media";

export interface ServiceData {
  id: number;
}

const clearSingle = async (client: PoolClient, data: ServiceData) => {
  const media = await service(
    mediaService.getSingle,
    false,
    client
  )({
    id: data.id,
  });

  const processedImages = await ProcessedImage.getAllByMediaKey(client, {
    media_key: media.key,
  });

  if (processedImages.length > 0) {
    await s3Service.deleteObjects({
      objects: processedImages.map((processedImage) => ({
        key: processedImage.key,
      })),
    });

    await ProcessedImage.deleteAllByMediaKey(client, {
      media_key: media.key,
    });
  }

  return;
};

export default clearSingle;
