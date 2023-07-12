import getS3Client from "@utils/app/s3-client";
import { GetObjectCommand } from "@aws-sdk/client-s3";
// Services
import Config from "@services/Config";

export interface ServiceData {
  key: string;
}

const streamMedia = async (data: ServiceData) => {
  const S3 = await getS3Client;

  const command = new GetObjectCommand({
    Bucket: Config.media.store.bucket,
    Key: data.key,
  });
  return S3.send(command);
};

export default streamMedia;
