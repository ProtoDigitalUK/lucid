// Utils
import { LucidError, modelErrors } from "@utils/app/error-handler";
// Models
import User from "@db/models/User";
import UserRole from "@db/models/UserRole";

interface ServiceData {
  userId: number;
}

const getAuthenticatedUser = async (data: ServiceData) => {
  const user = await User.getById(data.userId);

  if (!user) {
    throw new LucidError({
      type: "basic",
      name: "User Not Found",
      message: "There was an error finding the user.",
      status: 500,
      errors: modelErrors({
        id: {
          code: "user_not_found",
          message: "There was an error finding the user.",
        },
      }),
    });
  }

  const userPermissions = await UserRole.getPermissions(data.userId);

  // Add roles and permissions to the user object
  user.roles = userPermissions.roles;
  user.permissions = userPermissions.permissions;

  delete user.password;
  return user;
};

export default getAuthenticatedUser;
