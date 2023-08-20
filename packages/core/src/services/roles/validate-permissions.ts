import { PoolClient } from "pg";
import z from "zod";
// Schema
import roleSchema from "@schemas/roles";
// Utils
import { LucidError, ErrorResult, modelErrors } from "@utils/app/error-handler";
import service from "@utils/app/service";
// Services
import environmentsService from "@services/environments";
import Permissions from "@services/Permissions";
// Types
import {
  PermissionT,
  EnvironmentPermissionT,
} from "@lucid/types/src/permissions";

type SchemaPermissions = z.infer<
  typeof roleSchema.createSingle.body
>["permission_groups"];

const validatePermissions = async (
  client: PoolClient,
  permGroup: SchemaPermissions
) => {
  if (permGroup.length === 0) return [];

  const permissionSet = Permissions.permissions;
  const environmentsRes = await service(
    environmentsService.getAll,
    false,
    client
  )();

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
          const env = environmentsRes.find((e) => e.key === envKey);
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
