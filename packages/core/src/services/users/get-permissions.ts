import { PoolClient } from "pg";
// Models
import UserRole from "@db/models/UserRole.js";
// Format
import formatUserPermissions from "@utils/format/format-user-permissions.js";

export interface ServiceData {
  user_id: number;
}

const getPermissions = async (client: PoolClient, data: ServiceData) => {
  const userPermissions = await UserRole.getPermissions(client, {
    user_id: data.user_id,
  });

  if (!userPermissions) {
    return {
      roles: [],
      permissions: {
        global: [],
        environments: [],
      },
    };
  }

  return formatUserPermissions(userPermissions);
};

export default getPermissions;
