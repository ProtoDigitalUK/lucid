import { PoolClient } from "pg";
// Models
import ProcessedImage from "@db/models/ProcessedImage";
// Services
import s3Service from "@services/s3";

const clearAll = async (client: PoolClient) => {
  const processedImages = await ProcessedImage.getAll(client);

  await s3Service.deleteObjects({
    objects: processedImages.map((processedImage) => ({
      key: processedImage.key,
    })),
  });

  await ProcessedImage.deleteAll(client);

  return;
};

export default clearAll;
