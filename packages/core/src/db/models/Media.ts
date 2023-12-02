import { PoolClient } from "pg";
// Utils
import { type MediaMetaDataT } from "@utils/media/helpers.js";
import {
  queryDataFormat,
  SelectQueryBuilder,
} from "@utils/app/query-helpers.js";
// Types
import { MediaResT } from "@headless/types/src/media.js";

// -------------------------------------------
// Media
export type MediaT = {
  id: number;
  key: string;
  e_tag: string;

  type: MediaResT["type"];

  name_translation_key_id: number | null;
  alt_translation_key_id: number | null;

  name_translations: {
    language_id: number;
    value: string;
  }[];
  name_translation_value?: string | null;
  alt_translations: {
    language_id: number;
    value: string;
  }[];
  alt_translation_value?: string | null;

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
      text: `INSERT INTO headless_media (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING id`,
      values: values.value,
    });

    return media.rows[0];
  };
  static getMultiple: MediaGetMultiple = async (client, query_instance) => {
    const mediasRes = client.query<MediaT>({
      text: `SELECT 
            media.*, 
            name_translations.value AS name_translation_value,
            alt_translations.value AS alt_translation_value
        FROM 
            headless_media AS media
        LEFT JOIN headless_translations AS name_translations 
          ON media.name_translation_key_id = name_translations.translation_key_id
          AND name_translations.language_id = $1
        LEFT JOIN headless_translations AS alt_translations 
          ON media.alt_translation_key_id = alt_translations.translation_key_id
          AND alt_translations.language_id = $1
        ${query_instance.query.where}
        GROUP BY media.id, name_translations.value, alt_translations.value
        ${query_instance.query.order}
        ${query_instance.query.pagination}`,
      values: query_instance.values,
    });

    const count = client.query<{ count: string }>({
      text: `SELECT COUNT(DISTINCT media.id)
        FROM 
          headless_media AS media
        LEFT JOIN (
          SELECT 
              translation_key_id, 
              value
          FROM headless_translations
          WHERE language_id = $1
          LIMIT 1
        ) AS name_translations ON media.name_translation_key_id = name_translations.translation_key_id
        LEFT JOIN (
            SELECT 
                translation_key_id, 
                value
            FROM headless_translations
            WHERE language_id = $1
            LIMIT 1
        ) AS alt_translations ON media.alt_translation_key_id = alt_translations.translation_key_id
        ${query_instance.query.where}`,
      values: query_instance.countValues,
    });

    const data = await Promise.all([mediasRes, count]);

    return {
      data: data[0].rows,
      count: Number(data[1].rows[0].count),
    };
  };
  static getSingleById: MediaGetSingleById = async (client, data) => {
    const media = await client.query<MediaT>({
      text: `SELECT
        media.*,
        json_agg(
          json_build_object(
            'id', name_translations.id,
            'language_id', name_translations.language_id,
            'value', name_translations.value
          )
        ) FILTER (WHERE name_translations.id IS NOT NULL) AS name_translations,
        json_agg(
          json_build_object(
            'id', alt_translations.id,
            'language_id', alt_translations.language_id,
            'value', alt_translations.value
          )
        ) FILTER (WHERE alt_translations.id IS NOT NULL) AS alt_translations
      FROM
        headless_media AS media
      LEFT JOIN headless_translations AS name_translations
        ON media.name_translation_key_id = name_translations.translation_key_id
      LEFT JOIN headless_translations AS alt_translations
        ON media.alt_translation_key_id = alt_translations.translation_key_id
      WHERE
        media.id = $1
      GROUP BY
        media.id`,
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
          headless_media
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
            headless_media 
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
          headless_media
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
