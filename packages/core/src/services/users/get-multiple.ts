import { PoolClient } from "pg";
import z from "zod";
// Utils
import { SelectQueryBuilder } from "@utils/app/query-helpers";
// Models
import User from "@db/models/User";
// Schema
import usersSchema from "@schemas/users";
// Format
import formatUser from "@utils/format/format-user";

export interface ServiceData {
  query: z.infer<typeof usersSchema.getMultiple.query>;
}

const getMultiple = async (client: PoolClient, data: ServiceData) => {
  const { filter, sort, page, per_page } = data.query;

  // Build Query Data and Query
  const SelectQuery = new SelectQueryBuilder({
    columns: [
      "id",
      "email",
      "username",
      "first_name",
      "last_name",
      "created_at",
    ],
    exclude: undefined,
    filter: {
      data: filter,
      meta: {
        email: {
          operator: "%",
          type: "text",
          columnType: "standard",
        },
        username: {
          operator: "%",
          type: "text",
          columnType: "standard",
        },
        first_name: {
          operator: "%",
          type: "text",
          columnType: "standard",
        },
        last_name: {
          operator: "%",
          type: "text",
          columnType: "standard",
        },
      },
    },
    sort: sort,
    page: page,
    per_page: per_page,
  });

  const users = await User.getMultiple(client, SelectQuery);

  return {
    data: users.data.map((user) => formatUser(user)),
    count: users.count,
  };
};

export default getMultiple;
