// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import UserRole from "@db/models/UserRole";
// Services
import usersServices from "@services/users";
import roleServices from "@services/roles";

export interface ServiceData {
  user_id: number;
  role_ids: number[];
}

const updateRoles = async (data: ServiceData) => {
  // Get all users roles
  const userRoles = await usersServices.getAllRoles({
    user_id: data.user_id,
  });

  // Add roles that don't exist to the user
  const newRoles = data.role_ids.filter((role) => {
    return !userRoles.find((userRole) => userRole.role_id === role);
  });

  // Add the new roles to the user
  if (newRoles.length > 0) {
    const rolesRes = await roleServices.getMultiple({
      query: {
        filter: {
          role_ids: newRoles.map((role) => role.toString()),
        },
      },
    });
    if (rolesRes.count !== newRoles.length) {
      throw new LucidError({
        type: "basic",
        name: "Role Error",
        message: "One or more of the roles do not exist.",
        status: 500,
      });
    }

    await UserRole.updateRoles(data.user_id, {
      role_ids: newRoles,
    });
  }

  // Remove the other roles from the user
  const rolesToRemove = userRoles.filter((userRole) => {
    return !data.role_ids.find((role) => role === userRole.role_id);
  });

  if (rolesToRemove.length > 0) {
    const rolesToRemoveIds = rolesToRemove.map((role) => role.id);
    await UserRole.deleteMultiple(data.user_id, rolesToRemoveIds);
  }

  // Return the updated user roles
  const updatedUserRoles = await usersServices.getAllRoles({
    user_id: data.user_id,
  });

  return updatedUserRoles;
};

export default updateRoles;
