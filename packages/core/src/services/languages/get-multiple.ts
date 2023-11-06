import { PoolClient } from "pg";
import z from "zod";
// Utils
import { SelectQueryBuilder } from "@utils/app/query-helpers.js";
// Schema
import languagesSchema from "@schemas/languages.js";
// Models
import Language from "@db/models/Language.js";
// Format
import formatLanguage from "@utils/format/format-language.js";

export interface ServiceData {
  query: z.infer<typeof languagesSchema.getMultiple.query>;
}

const getSingle = async (client: PoolClient, data: ServiceData) => {
  const { sort, page, per_page } = data.query;

  // Build Query Data and Query
  const SelectQuery = new SelectQueryBuilder({
    columns: [
      "id",
      "code",
      "is_default",
      "is_enabled",
      "created_at",
      "updated_at",
    ],
    exclude: undefined,
    sort: {
      data: sort,
    },
    page: page,
    per_page: per_page,
  });

  const languages = await Language.getMultiple(client, SelectQuery);

  return {
    data: languages.data.map((lang) => formatLanguage(lang)),
    count: languages.count,
  };
};

export default getSingle;
