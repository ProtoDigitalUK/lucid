// Utils
import { LucidError, modelErrors } from "@utils/app/error-handler";
// Models
import User from "@db/models/User";
// Services
import usersServices from "@services/users";
// Format
import formatUser from "@utils/format/format-user";

export interface ServiceData {
  userId: number;
}

const getSingle = async (data: ServiceData) => {
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

  const userPermissions = await usersServices.getPermissions({
    user_id: user.id,
  });

  return formatUser(user, userPermissions);
};

export default getSingle;
