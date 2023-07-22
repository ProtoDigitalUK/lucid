import { PoolClient } from "pg";
import argon2 from "argon2";
// Utils
import { LucidError, modelErrors, ErrorResult } from "@utils/app/error-handler";
import service from "@utils/app/service";
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
  first_name?: string;
  last_name?: string;
  super_admin?: boolean;
  role_ids?: number[];
}

const registerSingle = async (
  client: PoolClient,
  data: ServiceData,
  current_user_id?: number
) => {
  let superAdmin = data.super_admin;

  // --------------------------------------------------
  // check if user exists
  const checkUserProm = Promise.all([
    service(
      usersServices.getSingleQuery,
      false,
      client
    )({
      email: data.email,
    }),
    service(
      usersServices.getSingleQuery,
      false,
      client
    )({
      username: data.username,
    }),
  ]);
  const [userByEmail, userByUsername] = await checkUserProm;

  if (userByEmail || userByUsername) {
    const errors: ErrorResult = {};
    if (userByEmail) {
      errors.email = {
        code: "email_already_exists",
        message: "A user with that email already exists.",
      };
    }
    if (userByUsername) {
      errors.username = {
        code: "username_already_exists",
        message: "A user with that username already exists.",
      };
    }
    throw new LucidError({
      type: "basic",
      name: "User Already Exists",
      message: "A user with that email or username already exists.",
      status: 400,
      errors: modelErrors(errors),
    });
  }

  await service(
    usersServices.checkIfUserExists,
    false,
    client
  )({
    email: data.email,
    username: data.username,
  });

  // --------------------------------------------------
  // Get the current user and only allow them to create super admins if they are a super admin
  if (current_user_id !== undefined && data.super_admin === true) {
    const currentUser = await service(
      usersServices.getSingle,
      false,
      client
    )({
      user_id: current_user_id,
    });

    if (!currentUser.super_admin) {
      superAdmin = false;
    }
  }

  const hashedPassword = await argon2.hash(data.password);

  // --------------------------------------------------
  // Create the user
  const user = await User.createSingle(client, {
    email: data.email,
    username: data.username,
    password: hashedPassword,
    super_admin: superAdmin,
    first_name: data.first_name,
    last_name: data.last_name,
  });

  if (!user) {
    throw new LucidError({
      type: "basic",
      name: "User Not Created",
      message: "There was an error creating the user.",
      status: 500,
    });
  }

  // --------------------------------------------------
  // Add the roles
  if (data.role_ids && data.role_ids.length > 0) {
    await service(
      usersServices.updateRoles,
      false,
      client
    )({
      user_id: user.id,
      role_ids: data.role_ids,
    });
  }
  // --------------------------------------------------
  // Get the user permissions and return the user
  const userPermissions = await service(
    usersServices.getPermissions,
    false,
    client
  )({
    user_id: user.id,
  });

  return formatUser(user, userPermissions);
};

export default registerSingle;
