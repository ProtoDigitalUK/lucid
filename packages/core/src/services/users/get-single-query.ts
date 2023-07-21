import { PoolClient } from "pg";
// Utils
import { SelectQueryBuilder } from "@utils/app/query-helpers";
// Models
import User from "@db/models/User";

export interface ServiceData {
  user_id?: number;
  email?: string;
  username?: string;
}

const getSingleQuery = async (client: PoolClient, data: ServiceData) => {
  const SelectQuery = new SelectQueryBuilder({
    columns: [
      "id",
      "super_admin",
      "email",
      "username",
      "first_name",
      "last_name",
      "created_at",
      "updated_at",
      "password",
      "reset_password",
    ],
    exclude: undefined,
    filter: {
      data: {
        id: data.user_id?.toString() || undefined,
        email: data.email || undefined,
        username: data.username || undefined,
      },
      meta: {
        id: {
          operator: "=",
          type: "int",
          columnType: "standard",
        },
        email: {
          operator: "=",
          type: "text",
          columnType: "standard",
        },
        username: {
          operator: "=",
          type: "text",
          columnType: "standard",
        },
      },
    },
    sort: undefined,
    page: undefined,
    per_page: undefined,
  });

  const user = await User.getSingle(client, SelectQuery);

  return user;
};

export default getSingleQuery;
