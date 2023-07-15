import { PoolClient } from "pg";
// Utils
import { LucidError } from "@utils/app/error-handler";
import service from "@utils/app/service";
// Serices
import authServices from "@services/auth";
import usersServices from "@services/users";

export interface ServiceData {
  username: string;
  password: string;
}

const login = async (client: PoolClient, data: ServiceData) => {
  const user = await service(
    usersServices.getSingleQuery,
    false,
    client
  )({
    username: data.username,
  });

  if (!user || !user.password) {
    throw new LucidError({
      type: "basic",
      name: "User Not Found",
      message: "The email or password you entered is incorrect.",
      status: 500,
    });
  }

  const passwordValid = await authServices.validatePassword({
    hashedPassword: user.password,
    password: data.password,
  });

  if (!passwordValid) {
    throw new LucidError({
      type: "basic",
      name: "User Not Found",
      message: "The email or password you entered is incorrect.",
      status: 500,
    });
  }

  return await service(
    usersServices.getSingle,
    false,
    client
  )({
    user_id: user.id,
  });
};

export default login;
