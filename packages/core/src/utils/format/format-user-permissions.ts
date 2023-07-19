// Models
import { UserRolePermissionRes } from "@db/models/UserRole";
// Services
import { PermissionT, EnvironmentPermissionT } from "@services/Permissions";
// Types
import {
  UserPermissionsResT,
  UserRoleResT,
  UserEnvrionmentResT,
} from "@lucid/types/src/users";

const formatUserPermissions = (
  permissionRes: Array<UserRolePermissionRes>
): UserPermissionsResT => {
  const roles: UserRoleResT[] = permissionRes
    .map((permission) => {
      return {
        id: permission.role_id,
        name: permission.role_name,
      };
    })
    .filter((role, index, self) => {
      return index === self.findIndex((r) => r.id === role.id);
    });

  const environments: UserEnvrionmentResT[] = [];
  const permissions: PermissionT[] = [];

  // Loop through each permission
  permissionRes.forEach((permission) => {
    // If the permission has an environment key
    if (permission.environment_key) {
      const env = environments.find(
        (env) => env.key === permission.environment_key
      );

      if (!env) {
        environments.push({
          key: permission.environment_key,
          permissions: [],
        });
      }
      // Check if the environment already has the permission
      const permExists = env?.permissions.find(
        (perm) => perm === permission.permission
      );
      if (!permExists)
        env?.permissions.push(permission.permission as EnvironmentPermissionT);
    } else {
      // Check if the permission already exists
      const permExists = permissions.find(
        (perm) => perm === permission.permission
      );
      if (!permExists) permissions.push(permission.permission as PermissionT);
    }
  });

  return {
    roles: roles,
    permissions: {
      global: permissions,
      environments: environments,
    },
  };
};

export default formatUserPermissions;
