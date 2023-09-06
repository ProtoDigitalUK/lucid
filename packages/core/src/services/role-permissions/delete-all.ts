import { PoolClient } from "pg";
// Models
import RolePermission from "@db/models/RolePermission.js";

export interface ServiceData {
  role_id: number;
}

const deleteAll = async (client: PoolClient, data: ServiceData) => {
  const permissions = await RolePermission.deleteAll(client, {
    role_id: data.role_id,
  });

  return permissions;
};

export default deleteAll;
