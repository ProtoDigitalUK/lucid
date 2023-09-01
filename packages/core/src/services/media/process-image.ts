import { PoolClient } from "pg";
import z from "zod";
import getS3Client from "@utils/app/s3-client";
// Types
import { Readable } from "stream";
// Schema
import mediaSchema from "@schemas/media";
// Services
import Media from "@services/media";

export interface ServiceData {
  key: string;
  query: z.infer<typeof mediaSchema.streamSingle.query>;
}

export interface Response {
  contentLength?: number;
  contentType?: string;
  body: Readable;
}

const processImage = async (
  client: PoolClient,
  data: ServiceData
): Promise<Response> => {
  const S3 = await getS3Client;

  // build image key (processed/key.format.width.height)
  const key = `processed/${data.key}`;
  if (data.query.format) key.concat(`.${data.query.format}`);
  if (data.query.width) key.concat(`.${data.query.width}`);
  if (data.query.height) key.concat(`.${data.query.height}`);

  // get image from s3/r2
  try {
    return Media.getS3Object({
      key: key,
    });
  } catch (err) {
    // process image

    return {
      contentLength: 0,
      contentType: "",
      body: new Readable(),
    };
  }
};

export default processImage;
