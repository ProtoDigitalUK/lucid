import { GetObjectCommand } from "@aws-sdk/client-s3";
import getS3Client from "@utils/app/s3-client";
// Types
import { Readable } from "stream";
// Services
import Config from "@services/Config";

export interface ServiceData {
  key: string;
}

export interface Response {
  contentLength?: number;
  contentType?: string;
  body: Readable;
}

const getS3Object = async (data: ServiceData): Promise<Response> => {
  const S3 = await getS3Client;

  const command = new GetObjectCommand({
    Bucket: Config.media.store.bucket,
    Key: data.key,
  });

  const res = await S3.send(command);

  if (res.Body === undefined) throw new Error("S3 object body is undefined");
  return {
    contentLength: res.ContentLength,
    contentType: res.ContentType,
    body: res.Body as Readable,
  };
};

export default getS3Object;
