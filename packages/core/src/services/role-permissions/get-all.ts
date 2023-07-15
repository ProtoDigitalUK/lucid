import { PoolClient } from "pg";
// Models
import RolePermission from "@db/models/RolePermission";

export interface ServiceData {
  role_id: number;
}

const getAll = async (client: PoolClient, data: ServiceData) => {
  const rolePermissions = await RolePermission.getAll(client, {
    role_id: data.role_id,
  });

  return rolePermissions;
};

export default getAll;
