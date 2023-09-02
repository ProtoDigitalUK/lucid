import { PoolClient } from "pg";
// Utils
import { queryDataFormat } from "@utils/app/query-helpers";

// -------------------------------------------
// Types
type ProcessImageCreateSingle = (
  client: PoolClient,
  data: {
    key: string;
    media_key: string;
  }
) => Promise<ProcessedImageT>;

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
      text: `INSERT INTO lucid_processed_images (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING key`,
      values: values.value,
    });

    return processedImage.rows[0];
  };
}
