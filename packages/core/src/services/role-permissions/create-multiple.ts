import { PoolClient } from "pg";
// Models
import RolePermission from "@db/models/RolePermission";
// Types
import {
  PermissionT,
  EnvironmentPermissionT,
} from "@lucid/types/src/permissions";

export interface ServiceData {
  role_id: number;
  permissions: Array<{
    permission: PermissionT | EnvironmentPermissionT;
    environment_key?: string;
  }>;
}

const createMultiple = async (client: PoolClient, data: ServiceData) => {
  const permissionsPromise = data.permissions.map((permission) => {
    return RolePermission.createSingle(client, {
      role_id: data.role_id,
      permission: permission.permission,
      environment_key: permission.environment_key,
    });
  });

  return await Promise.all(permissionsPromise);
};

export default createMultiple;
