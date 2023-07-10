import getDBClient from "@db/db";
import z from "zod";
import fileUpload from "express-fileupload";
// Utils
import helpers, { type MediaMetaDataT } from "@utils/media/helpers";
import formatMedia, { type MediaResT } from "@utils/media/format-media";
import mediaSchema from "@schemas/media";
import { LucidError, modelErrors } from "@utils/app/error-handler";
import { queryDataFormat, SelectQueryBuilder } from "@utils/app/query-helpers";
// Serices
import medias from "@services/media";
import s3 from "@services/s3";

// -------------------------------------------
// Types
type MediaCreateSingle = (data: {
  name?: string;
  alt?: string;
  files: fileUpload.FileArray | null | undefined;
}) => Promise<MediaResT>;

type MediaGetMultiple = (
  query: z.infer<typeof mediaSchema.getMultiple.query>
) => Promise<{
  data: MediaResT[];
  count: number;
}>;

type MediaGetSingle = (key: string) => Promise<MediaResT>;
type MediaGetSingleById = (id: number) => Promise<MediaResT>;
type MediaGetMultipleByIds = (ids: number[]) => Promise<MediaResT[]>;

type MediaDeleteSingle = (key: string) => Promise<MediaResT>;

type MediaUpdateSingle = (
  key: string,
  data: {
    name?: string;
    alt?: string;
    files: fileUpload.FileArray | null | undefined;
  }
) => Promise<MediaResT>;

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
    const client = await getDBClient;

    // -------------------------------------------
    // Data
    const { name, alt } = data;

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
    await medias.canStoreFiles({
      files,
    });

    // -------------------------------------------
    // Generate key and save file
    const key = helpers.uniqueKey(name || firstFile.name);
    const meta = await helpers.getMetaData(firstFile);
    const response = await s3.saveFile({
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
      await s3.deleteFile({
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
    await medias.setStorageUsed({
      add: meta.size,
    });

    // -------------------------------------------
    // Return
    return formatMedia(media.rows[0]);
  };
  static getMultiple: MediaGetMultiple = async (query) => {
    const client = await getDBClient;

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
      data: medias.rows.map((menu) => formatMedia(menu)),
      count: count.rows[0].count,
    };
  };
  static getSingle: MediaGetSingle = async (key) => {
    const client = await getDBClient;

    const media = await client.query<MediaT>({
      text: `SELECT
          *
        FROM
          lucid_media
        WHERE
          key = $1`,
      values: [key],
    });

    if (media.rowCount === 0) {
      throw new LucidError({
        type: "basic",
        name: "Media not found",
        message: "We couldn't find the media you were looking for.",
        status: 404,
      });
    }

    return formatMedia(media.rows[0]);
  };
  static getSingleById: MediaGetSingleById = async (id) => {
    const client = await getDBClient;

    const media = await client.query<MediaT>({
      text: `SELECT
          *
        FROM
          lucid_media
        WHERE
          id = $1`,
      values: [id],
    });

    if (media.rowCount === 0) {
      throw new LucidError({
        type: "basic",
        name: "Media not found",
        message: "We couldn't find the media you were looking for.",
        status: 404,
      });
    }

    return formatMedia(media.rows[0]);
  };
  static deleteSingle: MediaDeleteSingle = async (key) => {
    const client = await getDBClient;

    const media = await client.query<MediaT>({
      text: `DELETE FROM
          lucid_media
        WHERE
          key = $1
        RETURNING *`,
      values: [key],
    });

    if (media.rowCount === 0) {
      throw new LucidError({
        type: "basic",
        name: "Media not found",
        message: "Media not found",
        status: 404,
      });
    }

    await s3.deleteFile({
      key,
    });
    // update storage used
    await medias.setStorageUsed({
      add: 0,
      minus: media.rows[0].file_size,
    });

    return formatMedia(media.rows[0]);
  };
  static updateSingle: MediaUpdateSingle = async (key, data) => {
    const client = await getDBClient;

    // -------------------------------------------
    // Get Media
    const media = await Media.getSingle(key);

    // -------------------------------------------
    // Update Media
    let meta: MediaMetaDataT | undefined = undefined;
    if (data.files && data.files["file"]) {
      const files = helpers.formatReqFiles(data.files);
      const firstFile = files[0];

      // -------------------------------------------
      // Checks
      await medias.canStoreFiles({
        files,
      });

      // -------------------------------------------
      // Upload to S3
      meta = await helpers.getMetaData(firstFile);
      const response = await s3.saveFile({
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
      await medias.setStorageUsed({
        add: meta.size,
        minus: media.meta.file_size,
      });
    }

    // -------------------------------------------
    // Update Media Row
    const { columns, aliases, values } = queryDataFormat({
      columns: [
        "name",
        "alt",
        "mime_type",
        "file_extension",
        "file_size",
        "width",
        "height",
      ],
      values: [
        data.name,
        data.alt,
        meta?.mimeType,
        meta?.fileExtension,
        meta?.size,
        meta?.width,
        meta?.height,
      ],
      conditional: {
        hasValues: {
          updated_at: new Date().toISOString(),
        },
      },
    });

    if (values.value.length > 0) {
      const mediaRes = await client.query<MediaT>({
        text: `UPDATE 
            lucid_media 
          SET 
            ${columns.formatted.update} 
          WHERE 
            key = $${aliases.value.length + 1}
          RETURNING *`,
        values: [...values.value, key],
      });

      if (!mediaRes.rows[0]) {
        throw new LucidError({
          type: "basic",
          name: "Error updating media",
          message: "There was an error updating the media.",
          status: 500,
        });
      }
    }

    // -------------------------------------------
    // Return Media
    return Media.getSingle(key);
  };
  static getMultipleByIds: MediaGetMultipleByIds = async (ids) => {
    const client = await getDBClient;

    const media = await client.query<MediaT>({
      text: `SELECT
          *
        FROM
          lucid_media
        WHERE
          id = ANY($1)`,
      values: [ids],
    });

    return media.rows.map((m) => formatMedia(m));
  };
}
