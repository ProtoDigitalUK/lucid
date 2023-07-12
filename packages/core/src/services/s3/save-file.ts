import { PutObjectCommand } from "@aws-sdk/client-s3";
import fileUpload from "express-fileupload";
// Utils
import getS3Client from "@utils/media/s3-client";
import { type MediaMetaDataT } from "@utils/media/helpers";
// Services
import Config from "@services/Config";

export interface ServiceData {
  key: string;
  file: fileUpload.UploadedFile;
  meta: MediaMetaDataT;
}

const saveFile = async (data: ServiceData) => {
  const S3 = await getS3Client;

  const command = new PutObjectCommand({
    Bucket: Config.media.store.bucket,
    Key: data.key,
    Body: data.file.data,
    ContentType: data.meta.mimeType,
    Metadata: {
      width: data.meta.width?.toString() || "",
      height: data.meta.height?.toString() || "",
      extension: data.meta.fileExtension,
    },
  });
  return S3.send(command);
};

export default saveFile;
