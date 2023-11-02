import { PoolClient } from "pg";
// Utils
import { type MediaMetaDataT } from "@utils/media/helpers.js";
import {
  queryDataFormat,
  SelectQueryBuilder,
} from "@utils/app/query-helpers.js";
// Types
import { MediaResT } from "@lucid/types/src/media.js";

// -------------------------------------------
// Media
export type MediaT = {
  id: number;
  key: string;
  e_tag: string;

  type: MediaResT["type"];

  name_translation_key_id: number | null;
  alt_translation_key_id: number | null;

  mime_type: string;
  file_extension: string;
  file_size: number;
  width: number | null;
  height: number | null;

  created_at: string;
  updated_at: string;
};

export default class Media {
  static createSingle: MediaCreateSingle = async (client, data) => {
    // -------------------------------------------
    // Save to db
    const { columns, aliases, values } = queryDataFormat({
      columns: [
        "key",
        "e_tag",
        "type",
        "name_translation_key_id",
        "alt_translation_key_id",
        "mime_type",
        "file_extension",
        "file_size",
        "width",
        "height",
      ],
      values: [
        data.key,
        data.etag,
        data.type,
        data.name_translation_key_id,
        data.alt_translation_key_id,
        data.meta.mimeType,
        data.meta.fileExtension,
        data.meta.size,
        data.meta.width,
        data.meta.height,
      ],
    });

    const media = await client.query<MediaT>({
      text: `INSERT INTO lucid_media (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING id`,
      values: values.value,
    });

    return media.rows[0];
  };
  static getMultiple: MediaGetMultiple = async (client, query_instance) => {
    const mediasRes = client.query<MediaT>({
      text: `SELECT ${query_instance.query.select} FROM lucid_media ${query_instance.query.where} ${query_instance.query.order} ${query_instance.query.pagination}`,
      values: query_instance.values,
    });
    const count = client.query<{ count: string }>({
      text: `SELECT COUNT(DISTINCT lucid_media.id) FROM lucid_media ${query_instance.query.where}`,
      values: query_instance.countValues,
    });

    const data = await Promise.all([mediasRes, count]);

    return {
      data: data[0].rows,
      count: Number(data[1].rows[0].count),
    };
  };
  static getSingle: MediaGetSingle = async (client, data) => {
    const media = await client.query<MediaT>({
      text: `SELECT
          *
        FROM
          lucid_media
        WHERE
          key = $1`,
      values: [data.key],
    });

    return media.rows[0];
  };
  static getSingleById: MediaGetSingleById = async (client, data) => {
    const media = await client.query<MediaT>({
      text: `SELECT
          *
        FROM
          lucid_media
        WHERE
          id = $1`,
      values: [data.id],
    });

    return media.rows[0];
  };
  static deleteSingle: MediaDeleteSingle = async (client, data) => {
    const media = await client.query<{
      key: MediaT["key"];
      file_size: MediaT["file_size"];
    }>({
      text: `DELETE FROM
          lucid_media
        WHERE
          key = $1
        RETURNING key, file_size`,
      values: [data.key],
    });

    return media.rows[0];
  };
  static updateSingle: MediaUpdateSingle = async (client, data) => {
    // -------------------------------------------
    // Update Media Row
    const { columns, aliases, values } = queryDataFormat({
      columns: [
        "type",
        "mime_type",
        "file_extension",
        "file_size",
        "width",
        "height",
        "key",
      ],
      values: [
        data.type,
        data.meta?.mimeType,
        data.meta?.fileExtension,
        data.meta?.size,
        data.meta?.width,
        data.meta?.height,
        data.newKey,
      ],
      conditional: {
        hasValues: {
          updated_at: new Date().toISOString(),
        },
      },
    });

    const mediaRes = await client.query<{
      key: MediaT["key"];
    }>({
      text: `UPDATE 
            lucid_media 
          SET 
            ${columns.formatted.update} 
          WHERE 
            key = $${aliases.value.length + 1}
          RETURNING key`,
      values: [...values.value, data.key],
    });

    // -------------------------------------------
    // Return Media
    return mediaRes.rows[0];
  };
  static getMultipleByIds: MediaGetMultipleByIds = async (client, data) => {
    const media = await client.query<MediaT>({
      text: `SELECT
          *
        FROM
          lucid_media
        WHERE
          id = ANY($1)`,
      values: [data.ids],
    });

    return media.rows;
  };
}

// -------------------------------------------
// Types
type MediaCreateSingle = (
  client: PoolClient,
  data: {
    key: string;
    type: MediaResT["type"];
    etag?: string;
    name_translation_key_id?: number;
    alt_translation_key_id?: number;
    meta: MediaMetaDataT;
  }
) => Promise<{
  id: MediaT["id"];
}>;

type MediaGetMultiple = (
  client: PoolClient,
  query_instance: SelectQueryBuilder
) => Promise<{
  data: MediaT[];
  count: number;
}>;

type MediaGetSingle = (
  client: PoolClient,
  data: {
    key: string;
  }
) => Promise<MediaT>;

type MediaGetSingleById = (
  client: PoolClient,
  data: {
    id: number;
  }
) => Promise<MediaT>;

type MediaGetMultipleByIds = (
  client: PoolClient,
  data: {
    ids: number[];
  }
) => Promise<MediaT[]>;

type MediaDeleteSingle = (
  client: PoolClient,
  data: { key: string }
) => Promise<{
  key: MediaT["key"];
  file_size: MediaT["file_size"];
}>;

type MediaUpdateSingle = (
  client: PoolClient,
  data: {
    key: string;
    type?: MediaResT["type"];
    meta?: MediaMetaDataT;
    newKey?: string;
  }
) => Promise<{
  key: MediaT["key"];
}>;
