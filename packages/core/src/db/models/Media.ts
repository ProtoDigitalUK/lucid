import { PoolClient } from "pg";
// Utils
import { type MediaMetaDataT } from "@utils/media/helpers";
import { queryDataFormat, SelectQueryBuilder } from "@utils/app/query-helpers";

// -------------------------------------------
// Types
type MediaCreateSingle = (
  client: PoolClient,
  data: {
    key: string;
    name: string;
    etag?: string;
    alt?: string;
    meta: MediaMetaDataT;
  }
) => Promise<MediaT>;

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
) => Promise<MediaT>;

type MediaUpdateSingle = (
  client: PoolClient,
  data: {
    key: string;
    name?: string;
    alt?: string;
    meta?: MediaMetaDataT;
  }
) => Promise<MediaT>;

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
  static createSingle: MediaCreateSingle = async (client, data) => {
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
        data.key,
        data.etag,
        data.name,
        data.alt,
        data.meta.mimeType,
        data.meta.fileExtension,
        data.meta.size,
        data.meta.width,
        data.meta.height,
      ],
    });

    const media = await client.query<MediaT>({
      text: `INSERT INTO lucid_media (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
      values: values.value,
    });

    return media.rows[0];
  };
  static getMultiple: MediaGetMultiple = async (client, query_instance) => {
    const mediasRes = client.query<MediaT>({
      text: `SELECT${query_instance.query.select}FROMlucid_media${query_instance.query.where}${query_instance.query.order}${query_instance.query.pagination}`,
      values: query_instance.values,
    });
    const count = client.query<{ count: string }>({
      text: `SELECT COUNT(DISTINCT lucid_media.id)FROMlucid_media${query_instance.query.where} `,
      values: query_instance.countValues,
    });

    const data = await Promise.all([mediasRes, count]);

    return {
      data: data[0].rows,
      count: parseInt(data[1].rows[0].count),
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
    const media = await client.query<MediaT>({
      text: `DELETE FROM
          lucid_media
        WHERE
          key = $1
        RETURNING *`,
      values: [data.key],
    });

    return media.rows[0];
  };
  static updateSingle: MediaUpdateSingle = async (client, data) => {
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
        data.meta?.mimeType,
        data.meta?.fileExtension,
        data.meta?.size,
        data.meta?.width,
        data.meta?.height,
      ],
      conditional: {
        hasValues: {
          updated_at: new Date().toISOString(),
        },
      },
    });

    const mediaRes = await client.query<MediaT>({
      text: `UPDATE 
            lucid_media 
          SET 
            ${columns.formatted.update} 
          WHERE 
            key = $${aliases.value.length + 1}
          RETURNING *`,
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
