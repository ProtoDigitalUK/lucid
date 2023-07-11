// Models
import UserRole from "@db/models/UserRole";
// Services
import usersServices from "@services/users";

export interface ServiceData {
  user_id: number;
}

const getPermissions = async (data: ServiceData) => {
  const userPermissions = await UserRole.getPermissions(data.user_id);

  if (!userPermissions) {
    return {
      roles: [],
      permissions: {
        global: [],
        environments: [],
      },
    };
  }

  return usersServices.formatPermissions(userPermissions);
};

export default getPermissions;
