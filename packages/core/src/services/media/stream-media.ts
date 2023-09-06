import z from "zod";
// Types
import { Readable } from "stream";
// Schema
import mediaSchema from "@schemas/media.js";
// Utils
import helpers from "@utils/media/helpers.js";
import service from "@utils/app/service.js";
// Services
import mediaService from "@services/media/index.js";
import processedImageService from "@services/processed-images/index.js";

export interface ServiceData {
  key: string;
  query: z.infer<typeof mediaSchema.streamSingle.query>;
}

export interface ResponseT {
  contentLength?: number;
  contentType?: string;
  body?: Readable;
}

const streamMedia = async (
  data: ServiceData
): Promise<ResponseT | undefined> => {
  // --------------------------------------------------
  // Stream iamge from S3/R2
  if (
    data.query?.format === undefined &&
    data.query?.width === undefined &&
    data.query?.height === undefined
  ) {
    return await mediaService.getS3Object({
      key: data.key,
    });
  }

  // --------------------------------------------------
  // Process image
  const processKey = helpers.createProcessKey({
    key: data.key,
    query: data.query,
  });

  try {
    return await mediaService.getS3Object({
      key: processKey,
    });
  } catch (err) {
    return await service(
      processedImageService.processImage,
      false
    )({
      key: data.key,
      processKey: processKey,
      options: data.query,
    });
  }
};

export default streamMedia;
