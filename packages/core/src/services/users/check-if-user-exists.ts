import { PoolClient } from "pg";
// Utils
import { LucidError, modelErrors } from "@utils/app/error-handler";
// Models
import User from "@db/models/User";

export interface ServiceData {
  email: string;
  username: string;
}

const checkIfUserExists = async (client: PoolClient, data: ServiceData) => {
  // check if user exists
  const user = await User.checkIfUserExistsAlready(data.email, data.username);

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
