import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
// Utils
import getS3Client from "@utils/app/s3-client.js";
// Services
import Config from "@services/Config.js";

export interface ServiceData {
  objects: Array<{
    key: string;
  }>;
}

const deleteObjects = async (data: ServiceData) => {
  const S3 = await getS3Client;

  const command = new DeleteObjectsCommand({
    Bucket: Config.media.store.bucket,
    Delete: {
      Objects: data.objects.map((object) => ({
        Key: object.key,
      })),
    },
  });

  return S3.send(command);
};

export default deleteObjects;
