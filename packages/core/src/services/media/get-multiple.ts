import { PoolClient } from "pg";
import z from "zod";
// Utils
import { SelectQueryBuilder } from "@utils/app/query-helpers.js";
// Models
import Media from "@db/models/Media.js";
// Schema
import mediaSchema from "@schemas/media.js";
// Format
import formatMedia from "@utils/format/format-media.js";

export interface ServiceData {
  query: z.infer<typeof mediaSchema.getMultiple.query>;
}

const getMultiple = async (client: PoolClient, data: ServiceData) => {
  const { filter, sort, page, per_page } = data.query;

  // Build Query Data and Query
  const SelectQuery = new SelectQueryBuilder({
    columns: [
      "id",
      "key",
      "name_translation_key_id",
      "alt_translation_key_id",
      "e_tag",
      "type",
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
        type: {
          operator: "=",
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

  const mediasRes = await Media.getMultiple(client, SelectQuery);

  return {
    data: mediasRes.data.map((media) => formatMedia(media)),
    count: mediasRes.count,
  };
};

export default getMultiple;
