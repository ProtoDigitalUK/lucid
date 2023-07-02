import client from "@db/db";
import fileUpload from "express-fileupload";
import fs from "fs-extra";
import mime from "mime-types";
import sharp from "sharp";
import {
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  DeleteObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

// Utils
import { LucidError, modelErrors } from "@utils/error-handler";
import { queryDataFormat, SelectQueryBuilder } from "@utils/query-helpers";
// Schema
// Models
import Config from "@db/models/Config";
// Services
import S3 from "@services/media/s3-client";
import helpers, { type MediaMetaDataT } from "@services/media/helpers";

// -------------------------------------------
// Types
type MediaCreateSingle = (data: {
  name: string;
  alt?: string;
  files: fileUpload.FileArray | null | undefined;
}) => Promise<MediaT>;

// -------------------------------------------
// Media
export type MediaT = {
  id: number;
  key: string;
  e_tag: string;

  name: string;
  alt: string | null;

  mime_type: string;
  file_extension: string;
  file_size: number;
  width: number | null;
  height: number | null;

  created_at: string;
  updated_at: string;
};

export default class Media {
  // -------------------------------------------
  // Functions
  static createSingle: MediaCreateSingle = async (data) => {
    // -------------------------------------------
    // Data
    const { name, alt } = data;
    const files = helpers.formatReqFiles(data.files);
    const firstFile = files[0];

    // -------------------------------------------
    // Generate key and save file
    const key = helpers.uniqueKey(firstFile.name);
    const meta = await helpers.getMetaData(firstFile);
    const response = await Media.#saveFile(key, firstFile, meta);

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

    // -------------------------------------------
    // Save to db
    const { columns, aliases, values } = queryDataFormat({
      columns: [
        "key",
        "e_tag",
        "name",
        "alt",
        "mime_type",
        "file_extension",
        "file_size",
        "width",
        "height",
      ],
      values: [
        key,
        response.ETag?.replace(/"/g, ""),
        name,
        alt,
        meta.mimeType,
        meta.fileExtension,
        meta.size,
        meta.width,
        meta.height,
      ],
    });

    const media = await client.query<MediaT>({
      text: `INSERT INTO lucid_media (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
      values: values.value,
    });

    if (media.rowCount === 0) {
      await Media.#deleteFile(key);
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

    // -------------------------------------------
    // Return
    return media.rows[0];
  };
  // -------------------------------------------
  // Util Functions
  static #saveFile = async (
    key: string,
    file: fileUpload.UploadedFile,
    meta: MediaMetaDataT
  ) => {
    const command = new PutObjectCommand({
      Bucket: Config.media?.s3?.bucket,
      Key: key,
      Body: file.data,
      ContentType: meta.mimeType,
      Metadata: {
        width: meta.width?.toString() || "",
        height: meta.height?.toString() || "",
        extension: meta.fileExtension,
      },
    });
    return S3.send(command);
  };
  static #deleteFile = async (key: string) => {
    const command = new DeleteObjectCommand({
      Bucket: Config.media?.s3?.bucket,
      Key: key,
    });
    return S3.send(command);
  };
}
