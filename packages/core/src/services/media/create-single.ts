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
// Format
import formatMedia from "@utils/format/format-media.js";

export interface ServiceData {
  name?: string;
  alt?: string;
  files?: fileUpload.FileArray | null | undefined;
}

const createSingle = async (client: PoolClient, data: ServiceData) => {
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
  const key = helpers.uniqueKey(data.name || firstFile.name);
  const meta = await helpers.getMetaData(firstFile);
  const type = helpers.getMediaType(meta.mimeType);

  const response = await s3Service.saveObject({
    type: "file",
    key: key,
    file: firstFile,
    meta,
  });

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

  const media = await Media.createSingle(client, {
    key: key,
    name: data.name || firstFile.name,
    alt: data.alt,
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
