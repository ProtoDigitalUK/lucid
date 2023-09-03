import z from "zod";

// Utils
import helpers from "@utils/media/helpers";
// Types
import { PoolClient } from "pg";
import { Readable, PassThrough } from "stream";
// Schema
import mediaSchema from "@schemas/media";
// Services
import mediaService from "@services/media";
import s3Service from "@services/s3";
import processedImagesService from "@services/processed-images";
// Models
import ProcessedImage from "@db/models/ProcessedImage";
// Workers
import useProcessImage, {
  ProcessImageSuccessRes,
} from "@root/workers/process-image";

export interface ServiceData {
  key: string;
  processKey: string;
  options: z.infer<typeof mediaSchema.streamSingle.query>;
}

export interface Response {
  contentLength?: number;
  contentType?: string;
  body: Readable;
}

const saveAndRegister = async (
  client: PoolClient,
  data: ServiceData,
  image: ProcessImageSuccessRes["data"]
) => {
  try {
    await s3Service.saveObject({
      type: "buffer",
      key: data.processKey,
      buffer: image.buffer,
      meta: {
        mimeType: image.mimeType,
        fileExtension: image.extension,
        size: image.size,
        width: image.width,
        height: image.height,
      },
    });

    await ProcessedImage.createSingle(client, {
      key: data.processKey,
      media_key: data.key,
    });
  } catch (err) {
    // console.log(err);
    // fail silently
  }
};

const processImage = async (
  client: PoolClient,
  data: ServiceData
): Promise<Response> => {
  // Process and save image
  const s3Response = await mediaService.getS3Object({
    key: data.key,
  });

  // if resposne is not an image, return the original
  if (!s3Response.contentType?.startsWith("image/")) {
    return {
      contentLength: s3Response.contentLength,
      contentType: s3Response.contentType,
      body: s3Response.body,
    };
  }

  // Check if this image has reached the max number of processes
  try {
    await processedImagesService.getSingleCount(client, {
      key: data.key,
    });
  } catch (err) {
    // TODO: add warning log system and record this
    return {
      contentLength: s3Response.contentLength,
      contentType: s3Response.contentType,
      body: s3Response.body,
    };
  }

  const processRes = await useProcessImage({
    buffer: await helpers.streamToBuffer(s3Response.body),
    options: data.options,
  });

  const stream = new PassThrough();
  stream.end(Buffer.from(processRes.buffer));

  saveAndRegister(client, data, processRes);

  return {
    contentLength: processRes.size,
    contentType: processRes.mimeType,
    body: stream,
  };
};

export default processImage;
