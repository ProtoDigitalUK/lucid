import { GetObjectCommand } from "@aws-sdk/client-s3";
import getS3Client from "@utils/app/s3-client.js";
// Utils
import { HeadlessError } from "@utils/app/error-handler.js";
// Types
import { Readable } from "stream";
// Services
import Config from "@services/Config.js";

export interface ServiceData {
  key: string;
}

export interface Response {
  contentLength?: number;
  contentType?: string;
  body: Readable;
}

const getS3Object = async (data: ServiceData): Promise<Response> => {
  try {
    const S3 = await getS3Client;

    const command = new GetObjectCommand({
      Bucket: Config.media.store.bucket,
      Key: data.key,
    });

    const res = await S3.send(command);

    return {
      contentLength: res.ContentLength,
      contentType: res.ContentType,
      body: res.Body as Readable,
    };
  } catch (err) {
    const error = err as Error;
    throw new HeadlessError({
      type: "basic",
      name: error.name || "Error",
      message: error.message || "An error occurred",
      status: error.message === "The specified key does not exist." ? 404 : 500,
    });
  }
};

export default getS3Object;
