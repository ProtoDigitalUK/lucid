import { PoolClient } from "pg";
// Utils
import { HeadlessError } from "@utils/app/error-handler.js";
// Models
import ProcessedImage from "@db/models/ProcessedImage.js";
// Services
import Config from "@services/Config.js";

export interface ServiceData {
  key: string;
}

const getSingleCount = async (client: PoolClient, data: ServiceData) => {
  const limit = Config.media.processedImageLimit;

  const count = await ProcessedImage.getAllByMediaKeyCount(client, {
    media_key: data.key,
  });

  if (count >= limit) {
    throw new HeadlessError({
      type: "basic",
      name: "Processed image limit reached",
      message: `The processed image limit of ${limit} has been reached for this image.`,
      status: 400,
    });
  }

  return count;
};

export default getSingleCount;
