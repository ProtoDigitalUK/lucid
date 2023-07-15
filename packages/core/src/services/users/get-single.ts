import { PoolClient } from "pg";
// Utils
import { LucidError } from "@utils/app/error-handler";
import service from "@utils/app/service";
// Services
import usersServices from "@services/users";
// Format
import formatUser from "@utils/format/format-user";

export interface ServiceData {
  user_id?: number;
  email?: string;
  username?: string;
}

const getSingle = async (client: PoolClient, data: ServiceData) => {
  const user = await service(
    usersServices.getSingleQuery,
    false,
    client
  )({
    user_id: data.user_id,
    email: data.email,
    username: data.username,
  });

  if (!user) {
    throw new LucidError({
      type: "basic",
      name: "User Not Found",
      message: "There was an error finding the user.",
      status: 500,
    });
  }

  const userPermissions = await service(
    usersServices.getPermissions,
    false,
    client
  )({
    user_id: user.id,
  });

  return formatUser(user, userPermissions);
};

export default getSingle;
