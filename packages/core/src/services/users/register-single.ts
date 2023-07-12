import argon2 from "argon2";
// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import User from "@db/models/User";
// Services
import usersServices from "@services/users";
// Format
import formatUser from "@utils/format/format-user";

export interface ServiceData {
  email: string;
  username: string;
  password: string;
  super_admin?: boolean;
}

const registerSingle = async (data: ServiceData) => {
  // check if user exists
  await usersServices.checkIfUserExists({
    email: data.email,
    username: data.username,
  });

  const hashedPassword = await argon2.hash(data.password);

  const user = await User.register({
    email: data.email,
    username: data.username,
    password: hashedPassword,
    super_admin: data.super_admin,
  });

  if (!user) {
    throw new LucidError({
      type: "basic",
      name: "User Not Created",
      message: "There was an error creating the user.",
      status: 500,
    });
  }

  const userPermissions = await usersServices.getPermissions({
    user_id: user.id,
  });

  return formatUser(user, userPermissions);
};

export default registerSingle;
