import z from "zod";
// Utils
import { SelectQueryBuilder } from "@utils/app/query-helpers";
// Models
import Media from "@db/models/Media";
// Schema
import mediaSchema from "@schemas/media";
// Format
import formatMedia from "@utils/format/format-media";

export interface ServiceData {
  query: z.infer<typeof mediaSchema.getMultiple.query>;
}

const getMultiple = async (data: ServiceData) => {
  const { filter, sort, page, per_page } = data.query;

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

  const mediasRes = await Media.getMultiple(SelectQuery);

  return {
    data: mediasRes.data.map((media) => formatMedia(media)),
    count: mediasRes.count,
  };
};

export default getMultiple;
