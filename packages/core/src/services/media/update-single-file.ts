import { PoolClient } from "pg";
import { MultipartFile } from "@fastify/multipart";
// Utils
import helpers from "@utils/media/helpers.js";
import service from "@utils/app/service.js";
import { LucidError, modelErrors } from "@utils/app/error-handler.js";
// Models
import Media from "@db/models/Media.js";
// Services
import mediaService from "@services/media/index.js";
import s3Service from "@services/s3/index.js";
import processedImagesService from "@services/processed-images/index.js";

export interface ServiceData {
  id: number;
  fileData: MultipartFile | undefined;
}

const updateSingleFile = async (client: PoolClient, data: ServiceData) => {
  if (!data.fileData) {
    throw new LucidError({
      type: "basic",
      name: "No files provided",
      message: "No files provided",
      status: 400,
      errors: modelErrors({
        file: {
          code: "required",
          message: "No files provided",
        },
      }),
    });
  }

  const mediaPromise = service(
    mediaService.getSingle,
    false,
    client
  )({
    id: data.id,
  });
  const filePathPromise = helpers.saveStreamToTempFile(
    data.fileData.file,
    data.fileData.filename
  );

  const [media, filePath] = await Promise.all([mediaPromise, filePathPromise]);

  const key = helpers.uniqueKey(data.fileData.filename);
  const meta = await helpers.getMetaData({
    filePath,
    mimetype: data.fileData.mimetype,
  });
  const type = helpers.getMediaType(meta.mimeType);

  await service(
    mediaService.canStoreFiles,
    false,
    client
  )({
    size: meta.size,
    filename: data.fileData.filename,
  });

  const updateKeyRes = await s3Service.updateObjectKey({
    oldKey: media.key,
    newKey: key,
  });

  if (updateKeyRes.$metadata.httpStatusCode !== 200) {
    throw new LucidError({
      type: "basic",
      name: "Error updating file",
      message: "There was an error updating the file.",
      status: 500,
      errors: modelErrors({
        file: {
          code: "required",
          message: "There was an error updating the file.",
        },
      }),
    });
  }

  const saveFilePromise = s3Service.saveObject({
    type: "readable",
    key: key,
    readable: helpers.streamTempFile(filePath),
    meta,
  });
  const updateStoragePromise = service(
    mediaService.setStorageUsed,
    false,
    client
  )({
    add: meta.size,
    minus: media.meta.file_size,
  });
  const clearProcessedPromise = service(
    processedImagesService.clearSingle,
    false,
    client
  )({
    id: media.id,
  });
  const mediaUpdatePromise = Media.updateSingle(client, {
    key: media.key,
    meta: meta,
    type: type,
    newKey: key,
  });

  const [response] = await Promise.all([
    saveFilePromise,
    updateStoragePromise,
    clearProcessedPromise,
    mediaUpdatePromise,
  ]);

  if (response.$metadata.httpStatusCode !== 200) {
    throw new LucidError({
      type: "basic",
      name: "Error updating file",
      message: "There was an error updating the file.",
      status: 500,
      errors: modelErrors({
        file: {
          code: "required",
          message: "There was an error updating the file.",
        },
      }),
    });
  }

  helpers.deleteTempFile(filePath);

  return {
    id: media.id,
  };
};

export default updateSingleFile;
