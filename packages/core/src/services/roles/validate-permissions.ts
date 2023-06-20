import z from "zod";
// Models
import RolePermission, {
  PermissionT,
  EnvironmentPermissionT,
} from "@db/models/RolePermission";
import Config from "@db/models/Config";
// Schema
import roleSchema from "@schemas/roles";
// Utils
import { LucidError, ErrorResult, modelErrors } from "@utils/error-handler";

type SchemaPermissions = z.infer<
  typeof roleSchema.createSingle.body
>["permission_groups"];

const validatePermissions = async (permGroup: SchemaPermissions) => {
  const permissionSet = RolePermission.permissions;
  const environments = Config.environments;

  // Data
  const validPermissions: Array<{
    permission: PermissionT | EnvironmentPermissionT;
    environment_key?: string;
  }> = [];

  const permissionErrors: ErrorResult = {};
  const environmentErrors: ErrorResult = {};

  // Loop through the permissions array
  permGroup.forEach((obj) => {
    const envKey = obj.environment_key;
    for (let i = 0; i < obj.permissions.length; i++) {
      const permission = obj.permissions[i] as
        | PermissionT
        | EnvironmentPermissionT;

      // Check against global permissions
      if (!envKey) {
        if (permissionSet.global.includes(permission as PermissionT)) {
          validPermissions.push({
            permission,
          });
          continue;
        } else {
          if (!permissionErrors[permission]) {
            permissionErrors[permission] = {
              key: permission,
              code: "Invalid Permission",
              message: `The permission "${permission}" is invalid against global permissions.`,
            };
          }
        }
      }
      // Check against environment permissions
      else {
        if (
          permissionSet.environment.includes(
            permission as EnvironmentPermissionT
          )
        ) {
          // Check if the environment key is valid
          const env = environments.find((e) => e.key === envKey);
          if (!env) {
            if (!environmentErrors[envKey]) {
              environmentErrors[envKey] = {
                key: envKey,
                code: "Invalid Environment",
                message: `The environment key "${envKey}" is invalid.`,
              };
            }
            continue;
          }

          validPermissions.push({
            permission,
            environment_key: envKey,
          });
          continue;
        } else {
          if (!permissionErrors[permission]) {
            permissionErrors[permission] = {
              key: permission,
              code: "Invalid Permission",
              message: `The permission "${permission}" is invalid against environment permissions.`,
            };
          }
        }
      }
    }
  });

  if (
    Object.keys(permissionErrors).length > 0 ||
    Object.keys(environmentErrors).length > 0
  ) {
    throw new LucidError({
      type: "basic",
      name: "Role Error",
      message: "There was an error creating the role.",
      status: 500,
      errors: modelErrors({
        permissions: permissionErrors,
        environments: environmentErrors,
      }),
    });
  }

  return validPermissions;
};

export default validatePermissions;
