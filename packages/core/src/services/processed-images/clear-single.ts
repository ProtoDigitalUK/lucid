import { PoolClient } from "pg";
// Models
import ProcessedImage from "@db/models/ProcessedImage";
// Services
import s3Service from "@services/s3";

export interface ServiceData {
  key: string;
}

const clearSingle = async (client: PoolClient, data: ServiceData) => {
  const processedImages = await ProcessedImage.getAllByMediaKey(client, {
    media_key: data.key,
  });

  await s3Service.deleteObjects({
    objects: processedImages.map((processedImage) => ({
      key: processedImage.key,
    })),
  });

  await ProcessedImage.deleteAllByMediaKey(client, {
    media_key: data.key,
  });

  return;
};

export default clearSingle;
