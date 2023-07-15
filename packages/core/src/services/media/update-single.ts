import fileUpload from "express-fileupload";
// Utils
import helpers, { type MediaMetaDataT } from "@utils/media/helpers";
import { LucidError, modelErrors } from "@utils/app/error-handler";
// Models
import Media from "@db/models/Media";
// Services
import mediaService from "@services/media";
import s3Service from "@services/s3";

export interface ServiceData {
  key: string;
  data: {
    name?: string;
    alt?: string;
    files: fileUpload.FileArray | null | undefined;
  };
}

const updateSingle = async (data: ServiceData) => {
  // -------------------------------------------
  // Get Media
  const media = await mediaService.getSingle({
    key: data.key,
  });

  // -------------------------------------------
  // Update Media
  let meta: MediaMetaDataT | undefined = undefined;
  if (data.data.files && data.data.files["file"]) {
    const files = helpers.formatReqFiles(data.data.files);
    const firstFile = files[0];

    // -------------------------------------------
    // Checks
    await mediaService.canStoreFiles({
      files,
    });

    // -------------------------------------------
    // Upload to S3
    meta = await helpers.getMetaData(firstFile);

    const response = await s3Service.saveFile({
      key: media.key,
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
    await mediaService.setStorageUsed({
      add: meta.size,
      minus: media.meta.file_size,
    });
  }

  // -------------------------------------------
  // Update Media Row
  const mediaUpdate = await Media.updateSingle({
    key: data.key,
    name: data.data.name,
    alt: data.data.alt,
    meta: meta,
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
  return await mediaService.getSingle({
    key: mediaUpdate.key,
  });
};

export default updateSingle;
