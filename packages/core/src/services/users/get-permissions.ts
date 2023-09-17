import { PoolClient } from "pg";
// Models
import UserRole from "@db/models/UserRole.js";
// Format
import formatUserPermissions from "@utils/format/format-user-permissions.js";

export interface ServiceData {
  user_id: number;
}

const getPermissions = async (client: PoolClient, data: ServiceData) => {
  const userRoles = UserRole.getAll(client, {
    user_id: data.user_id,
  });
  const userPermissions = UserRole.getPermissions(client, {
    user_id: data.user_id,
  });

  const [roles, permissions] = await Promise.all([userRoles, userPermissions]);

  return formatUserPermissions(roles, permissions);
};

export default getPermissions;
