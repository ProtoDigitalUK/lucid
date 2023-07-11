import fileUpload from "express-fileupload";
// Utils
import helpers from "@utils/media/helpers";
import { LucidError, modelErrors } from "@utils/app/error-handler";
// Models
import Media from "@db/models/Media";
// Services
import mediaService from "@services/media";
import s3Service from "@services/s3";

export interface ServiceData {
  name?: string;
  alt?: string;
  files?: fileUpload.FileArray | null | undefined;
}

const createSingle = async (data: ServiceData) => {
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
  await mediaService.canStoreFiles({
    files,
  });

  // -------------------------------------------
  // Generate key and save file
  const key = helpers.uniqueKey(data.name || firstFile.name);
  const meta = await helpers.getMetaData(firstFile);
  const response = await s3Service.saveFile({
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

  const media = await Media.createSingle({
    key: key,
    name: data.name || firstFile.name,
    alt: data.alt,
    etag: response.ETag?.replace(/"/g, ""),
    meta: meta,
  });

  if (!media) {
    await s3Service.deleteFile({
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
  await mediaService.setStorageUsed({
    add: meta.size,
  });

  // -------------------------------------------
  // Return
  return mediaService.format(media);
};

export default createSingle;
