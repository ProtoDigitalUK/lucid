import z from "zod";
import { Response } from "express";
// Utils
import service from "@utils/app/service";
// Types
import { Readable } from "stream";
// Schema
import mediaSchema from "@schemas/media";
// Services
import mediaService from "@services/media";

export interface ServiceData {
  key: string;
  query: z.infer<typeof mediaSchema.streamSingle.query>;
  res: Response;
}

export interface ResponseT {
  contentLength?: number;
  contentType?: string;
  body?: Readable;
}

const streamMedia = async (
  data: ServiceData
): Promise<ResponseT | undefined> => {
  try {
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
    return await service(mediaService.processImage, false)(data);
  } catch (err) {
    await mediaService.streamErrorImage({
      fallback: data.query?.fallback,
      res: data.res,
    });
  }
};

export default streamMedia;
