import { PoolClient } from "pg";
import { MultipartFile } from "@fastify/multipart";
// Utils
import helpers from "@utils/media/helpers.js";
import service from "@utils/app/service.js";
import { HeadlessError, modelErrors } from "@utils/app/error-handler.js";
// Models
import Media from "@db/models/Media.js";
// Services
import mediaService from "@services/media/index.js";
import s3Service from "@services/s3/index.js";
import translationsService from "@services/translations/index.js";

export interface ServiceData {
  fileData: MultipartFile | undefined;
}

const uploadSingleFile = async (client: PoolClient, data: ServiceData) => {
  if (!data.fileData) {
    throw new HeadlessError({
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

  const filePath = await helpers.saveStreamToTempFile(
    data.fileData.file,
    data.fileData.filename
  );

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

  const s3Promise = s3Service.saveObject({
    type: "readable",
    key: key,
    readable: helpers.streamTempFile(filePath),
    meta,
  });
  const translationPromise = service(
    translationsService.createMultiple,
    false,
    client
  )({
    translations: {
      name: [],
      alt: [],
    },
  });

  const [response, translations] = await Promise.all([
    s3Promise,
    translationPromise,
  ]);

  if (response.$metadata.httpStatusCode !== 200) {
    throw new HeadlessError({
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

  const [media] = await Promise.all([
    Media.createSingle(client, {
      key: key,
      name_translation_key_id: translations.get("name"),
      alt_translation_key_id: translations.get("alt"),
      type: type,
      meta: meta,
      etag: response.ETag?.replace(/"/g, ""),
    }),
    service(
      mediaService.setStorageUsed,
      false,
      client
    )({
      add: meta.size,
    }),
    helpers.deleteTempFile(filePath),
  ]);

  if (!media) {
    await s3Service.deleteObject({
      key,
    });
    throw new HeadlessError({
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

  return {
    id: media.id,
  };
};

export default uploadSingleFile;
