import { PoolClient } from "pg";
import fileUpload from "express-fileupload";
// Utils
import helpers, { type MediaMetaDataT } from "@utils/media/helpers";
import { LucidError, modelErrors } from "@utils/app/error-handler";
import service from "@utils/app/service";
// Models
import Media from "@db/models/Media";
// Services
import mediaService from "@services/media";
import s3Service from "@services/s3";
import processedImagesService from "@services/processed-images";

export interface ServiceData {
  id: number;
  data: {
    name?: string;
    alt?: string;
    files: fileUpload.FileArray | null | undefined;
  };
}

const updateSingle = async (client: PoolClient, data: ServiceData) => {
  // -------------------------------------------
  // Get Media
  const media = await service(
    mediaService.getSingle,
    false,
    client
  )({
    id: data.id,
  });

  // -------------------------------------------
  // Update Media
  let meta: MediaMetaDataT | undefined = undefined;
  let newKey: string | undefined = undefined;
  if (data.data.files && data.data.files["file"]) {
    const files = helpers.formatReqFiles(data.data.files);
    const firstFile = files[0];

    // -------------------------------------------
    // Checks
    await service(
      mediaService.canStoreFiles,
      false,
      client
    )({
      files,
    });

    // -------------------------------------------
    // Upload to S3
    meta = await helpers.getMetaData(firstFile);
    newKey = helpers.uniqueKey(data.data.name || firstFile.name);

    const updateKeyRes = await s3Service.updateObjectKey({
      oldKey: media.key,
      newKey: newKey,
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

    const response = await s3Service.saveObject({
      type: "file",
      key: newKey,
      file: firstFile,
      meta,
    });

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

    // -------------------------------------------
    // Update storage used
    await service(
      mediaService.setStorageUsed,
      false,
      client
    )({
      add: meta.size,
      minus: media.meta.file_size,
    });

    // -------------------------------------------
    // Remove all processed images
    await service(
      processedImagesService.clearSingle,
      false,
      client
    )({
      id: media.id,
    });
  }

  // -------------------------------------------
  // Update Media Row
  const mediaUpdate = await Media.updateSingle(client, {
    key: media.key,
    name: data.data.name,
    alt: data.data.alt,
    meta: meta,
    newKey: newKey,
  });

  if (!mediaUpdate) {
    throw new LucidError({
      type: "basic",
      name: "Error updating media",
      message: "There was an error updating the media.",
      status: 500,
    });
  }

  // -------------------------------------------
  // Get Single
  return undefined;
};

export default updateSingle;
