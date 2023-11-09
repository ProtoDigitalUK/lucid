import { PoolClient } from "pg";
import { MultipartFile } from "@fastify/multipart";
// Utils
import helpers, { type MediaMetaDataT } from "@utils/media/helpers.js";
import { LucidError, modelErrors } from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";
// Models
import Media from "@db/models/Media.js";
// Types
import { MediaResT } from "@lucid/types/src/media.js";
// Services
import mediaService from "@services/media/index.js";
import s3Service from "@services/s3/index.js";
import processedImagesService from "@services/processed-images/index.js";
import translationsService from "@services/translations/index.js";

export interface ServiceData {
  id: number;
  data: {
    translations: string;
    fileData: MultipartFile | undefined;
  };
}

const updateSingle = async (client: PoolClient, data: ServiceData) => {
  const translationsData = translationsService.validateTranslations({
    translations: data.data.translations,
  });

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
  let newType: MediaResT["type"] | undefined = undefined;

  if (data.data.fileData && data.data.fileData.file) {
    const file = data.data.fileData.file;
    const firstName = translationsService.firstValueOfKey({
      translations: translationsData,
      key: "name",
    });

    // -------------------------------------------
    // Checks
    const size = await service(
      mediaService.canStoreFiles,
      false,
      client
    )({
      file: file,
      filename: data.data.fileData.filename,
    });

    // -------------------------------------------
    // Upload to S3
    meta = await helpers.getMetaData(file, {
      size,
      mimetype: data.data.fileData.mimetype,
    });
    newKey = helpers.uniqueKey(firstName || data.data.fileData.filename);
    newType = helpers.getMediaType(meta.mimeType);

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

    const saveFilePromise = s3Service.saveObject({
      type: "file",
      key: newKey,
      file: file,
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

    const [response] = await Promise.all([
      saveFilePromise,
      updateStoragePromise,
      clearProcessedPromise,
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
  }

  // -------------------------------------------
  // Update Media Row
  const mediaUpdatePromise = Media.updateSingle(client, {
    key: media.key,
    meta: meta,
    type: newType,
    newKey: newKey,
  });
  const updateMultipleTranslationsPromise = service(
    translationsService.updateMultiple,
    false,
    client
  )({
    translations: translationsData,
    keyMap: {
      name: media.name_translation_key_id,
      alt: media.alt_translation_key_id,
    },
  });

  const [mediaUpdate] = await Promise.all([
    mediaUpdatePromise,
    updateMultipleTranslationsPromise,
  ]);

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
