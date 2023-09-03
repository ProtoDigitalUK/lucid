import { PoolClient } from "pg";
// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import ProcessedImage from "@db/models/ProcessedImage";
// Services
import Config from "@services/Config";

export interface ServiceData {
  key: string;
}

const getSingleCount = async (client: PoolClient, data: ServiceData) => {
  const limit = Config.media.processedImageLimit;

  const count = await ProcessedImage.getAllByMediaKeyCount(client, {
    media_key: data.key,
  });

  if (count >= limit) {
    throw new LucidError({
      type: "basic",
      name: "Processed image limit reached",
      message: `The processed image limit of ${limit} has been reached for this image.`,
      status: 400,
    });
  }

  return count;
};

export default getSingleCount;
