// Models
import type { UserRolePermissionRes } from "@db/models/UserRole.js";
// Types
import {
  UserPermissionsResT,
  UserEnvrionmentResT,
} from "@lucid/types/src/users.js";
import {
  PermissionT,
  EnvironmentPermissionT,
} from "@lucid/types/src/permissions.js";

const formatUserPermissions = (
  roles: {
    id: number;
    name: string;
    role_id: number;
  }[],
  permissionRes: Array<UserRolePermissionRes>
): UserPermissionsResT => {
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
    roles: roles.map((role) => ({
      id: role.id,
      name: role.name,
    })),
    permissions: {
      global: permissions,
      environments: environments,
    },
  };
};

export default formatUserPermissions;
