import getDBClient from "@db/db";
// Utils
import { type MediaMetaDataT } from "@utils/media/helpers";
import { queryDataFormat, SelectQueryBuilder } from "@utils/app/query-helpers";

// -------------------------------------------
// Types
type MediaCreateSingle = (data: {
  key: string;
  name: string;
  etag?: string;
  alt?: string;
  meta: MediaMetaDataT;
}) => Promise<MediaT>;

type MediaGetMultiple = (query_instance: SelectQueryBuilder) => Promise<{
  data: MediaT[];
  count: number;
}>;

type MediaGetSingle = (key: string) => Promise<MediaT>;
type MediaGetSingleById = (id: number) => Promise<MediaT>;
type MediaGetMultipleByIds = (ids: number[]) => Promise<MediaT[]>;

type MediaDeleteSingle = (key: string) => Promise<MediaT>;

type MediaUpdateSingle = (
  key: string,
  data: {
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
  // -------------------------------------------
  // Functions
  static createSingle: MediaCreateSingle = async (data) => {
    const client = await getDBClient;

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
  static getMultiple: MediaGetMultiple = async (query_instance) => {
    const client = await getDBClient;

    const mediasRes = await client.query<MediaT>({
      text: `SELECT${query_instance.query.select}FROMlucid_media${query_instance.query.where}${query_instance.query.order}${query_instance.query.pagination}`,
      values: query_instance.values,
    });
    const count = await client.query<{ count: number }>({
      text: `SELECT COUNT(DISTINCT lucid_media.id)FROMlucid_media${query_instance.query.where} `,
      values: query_instance.countValues,
    });

    return {
      data: mediasRes.rows,
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

    return media.rows[0];
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

    return media.rows[0];
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

    return media.rows[0];
  };
  static updateSingle: MediaUpdateSingle = async (key, data) => {
    const client = await getDBClient;

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
      values: [...values.value, key],
    });

    // -------------------------------------------
    // Return Media
    return mediaRes.rows[0];
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

    return media.rows;
  };
}
