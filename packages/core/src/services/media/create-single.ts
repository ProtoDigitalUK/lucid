import { PoolClient } from "pg";
import fileUpload from "express-fileupload";
// Utils
import helpers from "@utils/media/helpers.js";
import service from "@utils/app/service.js";
import { LucidError, modelErrors } from "@utils/app/error-handler.js";
// Models
import Media from "@db/models/Media.js";
// Services
import mediaService from "@services/media/index.js";
import s3Service from "@services/s3/index.js";
import translationsService from "@services/translations/index.js";
// Format
import formatMedia from "@utils/format/format-media.js";

export interface ServiceData {
  translations: string;
  files?: fileUpload.FileArray | null | undefined;
}

const createSingle = async (client: PoolClient, data: ServiceData) => {
  const translationsData = translationsService.validateTranslations({
    translations: data.translations,
  });

  // -------------------------------------------
  // Data
  if (!data.files || !data.files["file"]) {
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

  const files = helpers.formatReqFiles(data.files);
  const firstFile = files[0];
  const firstName =
    data.translations.length > 0 ? translationsData[0].name : undefined;

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
  // Generate key and save file
  const key = helpers.uniqueKey(firstName || firstFile.name);
  const meta = await helpers.getMetaData(firstFile);
  const type = helpers.getMediaType(meta.mimeType);

  const s3Promise = s3Service.saveObject({
    type: "file",
    key: key,
    file: firstFile,
    meta,
  });
  const translationPromise = service(
    translationsService.createMultiple,
    false,
    client
  )({
    translations: {
      name: translationsData
        .filter((translation) => {
          return translation.name !== undefined;
        })
        .map((translation) => {
          return {
            language_id: translation.language_id,
            value: translation.name as string,
          };
        }),
      alt: translationsData
        .filter((translation) => {
          return translation.alt !== undefined;
        })
        .map((translation) => {
          return {
            language_id: translation.language_id,
            value: translation.alt as string,
          };
        }),
    },
  });

  const [response, translations] = await Promise.all([
    s3Promise,
    translationPromise,
  ]);

  // Error if file not saved
  if (response.$metadata.httpStatusCode !== 200) {
    throw new LucidError({
      type: "basic",
      name: "Error saving file",
      message: "Error saving file",
      status: 500,
      errors: modelErrors({
        file: {
          code: "required",
          message: "Error saving file",
        },
      }),
    });
  }

  // create media
  const media = await Media.createSingle(client, {
    key: key,
    name_translation_key_id: translations.get("name"),
    alt_translation_key_id: translations.get("alt"),
    etag: response.ETag?.replace(/"/g, ""),
    type: type,
    meta: meta,
  });

  if (!media) {
    await s3Service.deleteObject({
      key,
    });
    throw new LucidError({
      type: "basic",
      name: "Error saving file",
      message: "Error saving file",
      status: 500,
      errors: modelErrors({
        file: {
          code: "required",
          message: "Error saving file",
        },
      }),
    });
  }

  // update storage used
  await service(
    mediaService.setStorageUsed,
    false,
    client
  )({
    add: meta.size,
  });

  // -------------------------------------------
  // Return
  return formatMedia(media);
};

export default createSingle;
