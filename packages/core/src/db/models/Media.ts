import client from "@db/db";
import z from "zod";
import fileUpload from "express-fileupload";
import {
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
import Option from "@db/models/Option";
// Services
import S3 from "@services/media/s3-client";
import helpers, { type MediaMetaDataT } from "@services/media/helpers";
import formatMedia, { type MediaResT } from "@services/media/format-media";
import mediaSchema from "@schemas/media";

// -------------------------------------------
// Types
type MediaCreateSingle = (data: {
  location: string;
  name?: string;
  alt?: string;
  files: fileUpload.FileArray | null | undefined;
}) => Promise<MediaResT>;

type MediaGetMultiple = (
  query: z.infer<typeof mediaSchema.getMultiple.query>,
  data: {
    location: string;
  }
) => Promise<{
  data: MediaResT[];
  count: number;
}>;

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
    const { name, alt, location } = data;
    const files = helpers.formatReqFiles(data.files);
    const firstFile = files[0];

    // -------------------------------------------
    // Checks
    const canStoreRes = await Media.#canStoreFiles(files);
    if (!canStoreRes.can) {
      throw new LucidError({
        type: "basic",
        name: "Error saving file",
        message: canStoreRes.message,
        status: 500,
        errors: modelErrors({
          file: {
            code: "storage_limit",
            message: canStoreRes.message,
          },
        }),
      });
    }

    // -------------------------------------------
    // Generate key and save file
    const key = helpers.uniqueKey(name || firstFile.name);
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
        name || firstFile.name,
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

    // update storage used
    await Media.#setStorageUsed(meta.size);

    // -------------------------------------------
    // Return
    return formatMedia(media.rows[0], location);
  };
  static getMultiple: MediaGetMultiple = async (query, data) => {
    const { filter, sort, page, per_page } = query;

    // Build Query Data and Query
    const SelectQuery = new SelectQueryBuilder({
      columns: [
        "id",
        "key",
        "e_tag",
        "name",
        "alt",
        "mime_type",
        "file_extension",
        "file_size",
        "width",
        "height",
        "created_at",
        "updated_at",
      ],
      filter: {
        data: filter,
        meta: {
          name: {
            operator: "%",
            type: "text",
            columnType: "standard",
          },
          key: {
            operator: "%",
            type: "text",
            columnType: "standard",
          },
          mime_type: {
            operator: "=",
            type: "text",
            columnType: "standard",
          },
          file_extension: {
            operator: "=",
            type: "text",
            columnType: "standard",
          },
        },
      },
      sort: sort,
      page: page,
      per_page: per_page,
    });

    const medias = await client.query<MediaT>({
      text: `SELECT
          ${SelectQuery.query.select}
        FROM
          lucid_media
        ${SelectQuery.query.where}
        ${SelectQuery.query.order}
        ${SelectQuery.query.pagination}`,
      values: SelectQuery.values,
    });
    const count = await client.query<{ count: number }>({
      text: `SELECT 
          COUNT(DISTINCT lucid_media.id)
        FROM
          lucid_media
        ${SelectQuery.query.where} `,
      values: SelectQuery.countValues,
    });

    return {
      data: medias.rows.map((menu) => formatMedia(menu, data.location)),
      count: count.rows[0].count,
    };
  };
  static streamFile = async (key: string) => {
    const command = new GetObjectCommand({
      Bucket: Config.media?.s3?.bucket,
      Key: key,
    });
    return S3.send(command);
  };
  // -------------------------------------------
  // Storage Functions
  static #getStorageUsed = async () => {
    const res = await Option.getByName("media_storage_used");
    return res.option_value as number;
  };
  static #setStorageUsed = async (value: number) => {
    const storageUsed = await Media.#getStorageUsed();
    const newValue = storageUsed + value;

    const res = await Option.patchByName({
      name: "media_storage_used",
      value: newValue,
      type: "number",
      locked: false,
    });
    return res.option_value as number;
  };
  static #canStoreFiles = async (files: fileUpload.UploadedFile[]) => {
    const { storageLimit, maxFileSize } = Config.media;

    // check files dont exceed max file size limit
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > maxFileSize) {
        return {
          can: false,
          message: `File ${file.name} is too large. Max file size is ${maxFileSize} bytes.`,
        };
      }
    }

    // get the total size of all files
    const storageUsed = await Media.#getStorageUsed();

    // check files dont exceed storage limit
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    if (totalSize + storageUsed > storageLimit) {
      return {
        can: false,
        message: `Files exceed storage limit. Max storage limit is ${storageLimit} bytes.`,
      };
    }

    return { can: true };
  };
  // -------------------------------------------
  // S3 Functions
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
