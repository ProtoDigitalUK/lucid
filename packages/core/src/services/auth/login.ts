import { PoolClient } from "pg";
// Utils
import { HeadlessError } from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";
// Serices
import authServices from "@services/auth/index.js";
import usersServices from "@services/users/index.js";

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
    throw new HeadlessError({
      type: "basic",
      name: "User Not Found",
      message: "The username or password you entered is incorrect.",
      status: 500,
    });
  }

  const passwordValid = await authServices.validatePassword({
    hashedPassword: user.password,
    password: data.password,
  });

  if (!passwordValid) {
    throw new HeadlessError({
      type: "basic",
      name: "User Not Found",
      message: "The username or password you entered is incorrect.",
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
