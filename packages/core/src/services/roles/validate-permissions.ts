import z from "zod";
// Models
import RolePermission, { PermissionT } from "@db/models/RolePermission";
import Environment from "@db/models/Environment";
// Schema
import roleSchema from "@schemas/roles";
// Utils
import { LucidError, ErrorResult, modelErrors } from "@utils/error-handler";

type SchemaPermissions = z.infer<
  typeof roleSchema.createSingle.body
>["permission_groups"];

const validatePermissions = async (permGroup: SchemaPermissions) => {
  const permissionSet = RolePermission.permissions;
  const environments = await Environment.getAll();

  // Data
  const validPermissions: Array<{
    permission: PermissionT;
    environment_key?: string;
  }> = [];
  const permissionErrors: ErrorResult = {};
  const environmentErrors: ErrorResult = {};

  // Loop through the permissions array
  permGroup.forEach((obj) => {
    const envKey = obj.environment_key;
    obj.permissions.forEach((p) => {
      const permission = p as PermissionT;

      if (!envKey) {
        if (permissionSet.includes(permission)) {
          validPermissions.push({
            permission,
          });
        } else {
          // Top level errors
          if (!permissionErrors[permission]) {
            permissionErrors[permission] = {
              key: permission,
              code: "Invalid Permission",
              message: `The permission "${permission}" is invalid.`,
            };
          }
        }
      } else {
        const env = environments.find((env) => env.key === envKey);
        console.log(env);
        if (env) {
          if (permissionSet.includes(permission)) {
            validPermissions.push({
              permission,
              environment_key: envKey,
            });
          } else {
            if (!environmentErrors[envKey]) {
              environmentErrors[envKey] = {
                key: envKey,
                code: "Invalid Envrionment",
                message: `The environment "${envKey}" is invalid.`,
              };
            }
            const envError = environmentErrors[envKey] as ErrorResult;
            if (!envError[permission]) {
              envError[permission] = {
                key: permission,
                code: "Invalid Permission",
                message: `The permission "${permission}" is invalid against the environment "${envKey}".`,
              };
            }
          }
        } else {
          if (!environmentErrors[envKey]) {
            environmentErrors[envKey] = {
              key: envKey,
              code: "Invalid Envrionment",
              message: `The environment "${envKey}" is invalid.`,
            };
          }
          if (!permissionSet.includes(permission)) {
            const envError = environmentErrors[envKey] as ErrorResult;
            if (!envError[permission]) {
              envError[permission] = {
                key: permission,
                code: "Invalid Permission",
                message: `The permission "${permission}" is invalid against the environment "${envKey}".`,
              };
            }
          }
        }
      }
    });
  });

  if (
    Object.keys(environmentErrors).length > 0 ||
    Object.keys(permissionErrors).length > 0
  ) {
    throw new LucidError({
      type: "basic",
      name: "Role Error",
      message: "There was an error creating the role.",
      status: 500,
      errors: {
        body: {
          permissions: permissionErrors,
          environments: environmentErrors,
        },
      },
    });
  }

  return validPermissions;
};

export default validatePermissions;
