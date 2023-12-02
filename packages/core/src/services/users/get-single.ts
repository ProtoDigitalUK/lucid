import { PoolClient } from "pg";
// Utils
import { HeadlessError } from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";
// Services
import usersServices from "@services/users/index.js";
// Format
import formatUser from "@utils/format/format-user.js";

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
    throw new HeadlessError({
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
