import { PoolClient } from "pg";
// Models
import ProcessedImage from "@db/models/ProcessedImage.js";
// Services
import s3Service from "@services/s3/index.js";

const clearAll = async (client: PoolClient) => {
  const processedImages = await ProcessedImage.getAll(client);

  if (processedImages.length > 0) {
    await s3Service.deleteObjects({
      objects: processedImages.map((processedImage) => ({
        key: processedImage.key,
      })),
    });

    await ProcessedImage.deleteAll(client);
  }

  return;
};

export default clearAll;
