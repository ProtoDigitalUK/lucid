import { PoolClient } from "pg";
// Utils
import { HeadlessError } from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";
// Models
import UserRole from "@db/models/UserRole.js";
// Services
import roleServices from "@services/roles/index.js";

export interface ServiceData {
  user_id: number;
  role_ids: number[];
}

const updateRoles = async (client: PoolClient, data: ServiceData) => {
  // Get all users roles
  const userRoles = await UserRole.getAll(client, {
    user_id: data.user_id,
  });

  // Add roles that don't exist to the user
  const newRoles = data.role_ids.filter((role) => {
    return !userRoles.find((userRole) => userRole.role_id === role);
  });

  // Add the new roles to the user
  if (newRoles.length > 0) {
    const rolesRes = await service(
      roleServices.getMultiple,
      false,
      client
    )({
      query: {
        filter: {
          role_ids: newRoles.map((role) => role.toString()),
        },
      },
    });
    if (rolesRes.count !== newRoles.length) {
      throw new HeadlessError({
        type: "basic",
        name: "Role Error",
        message: "One or more of the roles do not exist.",
        status: 500,
      });
    }

    await UserRole.updateRoles(client, {
      user_id: data.user_id,
      role_ids: newRoles,
    });
  }

  // Remove the other roles from the user
  const rolesToRemove = userRoles.filter((userRole) => {
    return !data.role_ids.find((role) => role === userRole.role_id);
  });

  if (rolesToRemove.length > 0) {
    const rolesToRemoveIds = rolesToRemove.map((role) => role.id);
    await UserRole.deleteMultiple(client, {
      user_id: data.user_id,
      role_ids: rolesToRemoveIds,
    });
  }

  // Return the updated user roles
  const updatedUserRoles = await UserRole.getAll(client, {
    user_id: data.user_id,
  });

  return updatedUserRoles;
};

export default updateRoles;
