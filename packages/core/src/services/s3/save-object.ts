import { PutObjectCommand } from "@aws-sdk/client-s3";
import fileUpload from "express-fileupload";
// Utils
import getS3Client from "@utils/app/s3-client.js";
import { type MediaMetaDataT } from "@utils/media/helpers.js";
// Services
import Config from "@services/Config.js";

export interface ServiceData {
  type: "file" | "buffer";

  key: string;
  file?: fileUpload.UploadedFile;
  buffer?: Buffer;
  meta: MediaMetaDataT;
}

const saveObject = async (data: ServiceData) => {
  const S3 = await getS3Client;

  const command = new PutObjectCommand({
    Bucket: Config.media.store.bucket,
    Key: data.key,
    Body: data.type === "file" ? data.file?.data : data.buffer,
    ContentType: data.meta.mimeType,
    Metadata: {
      width: data.meta.width?.toString() || "",
      height: data.meta.height?.toString() || "",
      extension: data.meta.fileExtension,
    },
  });
  return S3.send(command);
};

export default saveObject;
