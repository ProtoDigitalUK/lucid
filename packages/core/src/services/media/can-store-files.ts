import { PoolClient } from "pg";
import { BusboyFileStream } from "@fastify/busboy";
// Utils
import service from "@utils/app/service.js";
import helpers from "@utils/media/helpers.js";
import { LucidError, modelErrors } from "@utils/app/error-handler.js";
// Services
import Config from "@services/Config.js";
import mediaService from "@services/media/index.js";

export interface ServiceData {
  file: BusboyFileStream;
  filename: string;
}

const canStoreFiles = async (client: PoolClient, data: ServiceData) => {
  const { storageLimit, maxFileSize } = Config.media;

  const fileSize = await helpers.getFileSize(data.file);

  if (fileSize > maxFileSize) {
    const message = `File ${data.filename} is too large. Max file size is ${maxFileSize} bytes.`;
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

  // get the total size of all files
  const storageUsed = await service(
    mediaService.getStorageUsed,
    false,
    client
  )();

  // check files dont exceed storage limit
  // const totalSize = data.files.reduce((acc, file) => acc + file.size, 0);
  if (fileSize + (storageUsed || 0) > storageLimit) {
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

  return fileSize;
};

export default canStoreFiles;
