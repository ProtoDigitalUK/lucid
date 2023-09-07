import { PoolClient } from "pg";
// Utils
import { LucidError, modelErrors } from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";
// Serices
import usersServices from "@services/users/index.js";

export interface ServiceData {
  email: string;
  username: string;
}

const checkIfUserExists = async (client: PoolClient, data: ServiceData) => {
  // check if user exists
  const user = await service(
    usersServices.getSingleQuery,
    false,
    client
  )({
    email: data.email,
    username: data.username,
  });

  if (user) {
    throw new LucidError({
      type: "basic",
      name: "User Already Exists",
      message: "A user with that email or username already exists.",
      status: 400,
      errors: modelErrors({
        email: {
          code: "email_already_exists",
          message: "A user with that email already exists.",
        },
        username: {
          code: "username_already_exists",
          message: "A user with that username already exists.",
        },
      }),
    });
  }

  return user;
};

export default checkIfUserExists;
