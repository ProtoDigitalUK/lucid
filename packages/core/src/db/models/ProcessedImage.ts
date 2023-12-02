import { PoolClient } from "pg";
// Utils
import { queryDataFormat } from "@utils/app/query-helpers.js";

// -------------------------------------------
// Types
type ProcessImageCreateSingle = (
  client: PoolClient,
  data: {
    key: string;
    media_key: string;
  }
) => Promise<ProcessedImageT>;

type ProcessImageGetAllByMediaKey = (
  client: PoolClient,
  data: {
    media_key: string;
  }
) => Promise<ProcessedImageT[]>;

type ProcessImageDeleteAllByMediaKey = (
  client: PoolClient,
  data: {
    media_key: string;
  }
) => Promise<ProcessedImageT[]>;

type ProcessImageGetAllByMediaKeyCount = (
  client: PoolClient,
  data: {
    media_key: string;
  }
) => Promise<number>;

type ProcessImageGetAllCount = (client: PoolClient) => Promise<number>;

// -------------------------------------------
// Processed imaged
export type ProcessedImageT = {
  key: string;
  media_key: string;
};

export default class ProcessedImage {
  static createSingle: ProcessImageCreateSingle = async (client, data) => {
    // -------------------------------------------
    // Save to db
    const { columns, aliases, values } = queryDataFormat({
      columns: ["key", "media_key"],
      values: [data.key, data.media_key],
    });

    const processedImage = await client.query<ProcessedImageT>({
      text: `INSERT INTO headless_processed_images (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING key`,
      values: values.value,
    });

    return processedImage.rows[0];
  };

  static getAllByMediaKey: ProcessImageGetAllByMediaKey = async (
    client,
    data
  ) => {
    const processedImages = await client.query<ProcessedImageT>({
      text: `SELECT * FROM headless_processed_images WHERE media_key = $1`,
      values: [data.media_key],
    });

    return processedImages.rows;
  };
  static deleteAllByMediaKey: ProcessImageDeleteAllByMediaKey = async (
    client,
    data
  ) => {
    const processedImages = await client.query<ProcessedImageT>({
      text: `DELETE FROM headless_processed_images WHERE media_key = $1`,
      values: [data.media_key],
    });

    return processedImages.rows;
  };

  static getAll = async (client: PoolClient) => {
    const processedImages = await client.query<ProcessedImageT>({
      text: `SELECT * FROM headless_processed_images`,
    });

    return processedImages.rows;
  };
  static deleteAll = async (client: PoolClient) => {
    const processedImages = await client.query<ProcessedImageT>({
      text: `DELETE FROM headless_processed_images`,
    });

    return processedImages.rows;
  };

  static getAllByMediaKeyCount: ProcessImageGetAllByMediaKeyCount = async (
    client,
    data
  ) => {
    const processedImages = await client.query<{
      count: string;
    }>({
      text: `SELECT COUNT(*) FROM headless_processed_images WHERE media_key = $1`,
      values: [data.media_key],
    });

    return Number(processedImages.rows[0].count);
  };
  static getAllCount: ProcessImageGetAllCount = async (client) => {
    const processedImages = await client.query<{
      count: string;
    }>({
      text: `SELECT COUNT(*) FROM headless_processed_images`,
    });

    return Number(processedImages.rows[0].count);
  };
}
