import { DeleteObjectCommand, CopyObjectCommand } from "@aws-sdk/client-s3";
// Utils
import getS3Client from "@utils/app/s3-client.js";
// Services
import Config from "@services/Config.js";

export interface ServiceData {
  newKey: string;
  oldKey: string;
}

const updateObjectKey = async (data: ServiceData) => {
  const S3 = await getS3Client;

  // copy with new key
  const copyCommand = new CopyObjectCommand({
    Bucket: Config.media.store.bucket,
    CopySource: `${Config.media.store.bucket}/${data.oldKey}`,
    Key: data.newKey,
  });
  const res = await S3.send(copyCommand);

  // delete old key
  const command = new DeleteObjectCommand({
    Bucket: Config.media.store.bucket,
    Key: data.oldKey,
  });

  await S3.send(command);

  return res;
};

export default updateObjectKey;
