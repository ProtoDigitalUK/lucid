import { PoolClient } from "pg";
// Models
import RolePermission from "@db/models/RolePermission";

export interface ServiceData {
  ids: number[];
}

const deleteMultiple = async (client: PoolClient, data: ServiceData) => {
  const permissionsPromise = data.ids.map((id) => {
    return RolePermission.deleteSingle(client, {
      id: id,
    });
  });

  const permissions = await Promise.all(permissionsPromise);

  return permissions;
};

export default deleteMultiple;
