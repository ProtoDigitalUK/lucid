// Models
import RolePermission from "@db/models/RolePermission";
// Services
import { PermissionT, EnvironmentPermissionT } from "@services/Permissions";

export interface ServiceData {
  role_id: number;
  permissions: Array<{
    permission: PermissionT | EnvironmentPermissionT;
    environment_key?: string;
  }>;
}

const createMultiple = async (data: ServiceData) => {
  const permissionsPromise = data.permissions.map((permission) => {
    return RolePermission.createSingle(
      data.role_id,
      permission.permission,
      permission.environment_key
    );
  });

  return await Promise.all(permissionsPromise);
};

export default createMultiple;
