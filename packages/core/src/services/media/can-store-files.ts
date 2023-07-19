import { PoolClient } from "pg";
import fileUpload from "express-fileupload";
// Utils
import service from "@utils/app/service";
import { LucidError, modelErrors } from "@utils/app/error-handler";
// Services
import Config from "@services/Config";
import mediaService from "@services/media";

export interface ServiceData {
  files: fileUpload.UploadedFile[];
}

const canStoreFiles = async (client: PoolClient, data: ServiceData) => {
  const { storageLimit, maxFileSize } = Config.media;

  // check files dont exceed max file size limit
  for (let i = 0; i < data.files.length; i++) {
    const file = data.files[i];
    if (file.size > maxFileSize) {
      const message = `File ${file.name} is too large. Max file size is ${maxFileSize} bytes.`;
      throw new LucidError({
        type: "basic",
        name: "Error saving file",
        message: message,
        status: 500,
        errors: modelErrors({
          file: {
            code: "storage_limit",
            message: message,
          },
        }),
      });
    }
  }

  // get the total size of all files
  const storageUsed = await service(
    mediaService.getStorageUsed,
    false,
    client
  )();

  // check files dont exceed storage limit
  const totalSize = data.files.reduce((acc, file) => acc + file.size, 0);
  if (totalSize + (storageUsed || 0) > storageLimit) {
    const message = `Files exceed storage limit. Max storage limit is ${storageLimit} bytes.`;
    throw new LucidError({
      type: "basic",
      name: "Error saving file",
      message: message,
      status: 500,
      errors: modelErrors({
        file: {
          code: "storage_limit",
          message: message,
        },
      }),
    });
  }
};

export default canStoreFiles;
