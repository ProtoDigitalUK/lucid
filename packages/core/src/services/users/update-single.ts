import { PoolClient } from "pg";
import argon2 from "argon2";
// Utils
import {
  LucidError,
  ErrorResult,
  modelErrors,
} from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";
// Models
import User from "@db/models/User.js";
// Serices
import usersServices from "@services/users/index.js";

export interface ServiceData {
  user_id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
  password?: string;
  role_ids?: number[];
  super_admin?: boolean;
}

const updateSingle = async (
  client: PoolClient,
  data: ServiceData,
  current_user_id?: number
) => {
  // -------------------------------------------
  // Check if user exists
  const user = await service(
    usersServices.getSingle,
    false,
    client
  )({
    user_id: data.user_id,
  });

  // Remove data that is the same as the user
  if (data.first_name !== undefined && data.first_name === user.first_name)
    delete data.first_name;
  if (data.last_name !== undefined && data.last_name === user.last_name)
    delete data.last_name;
  if (data.username !== undefined && data.username === user.username)
    delete data.username;
  if (data.email !== undefined && data.email === user.email) delete data.email;

  // -------------------------------------------
  // Unique Checks
  const [usernameCheck, emailCheck] = await Promise.all([
    // Check username
    data.username !== undefined
      ? service(
          usersServices.getSingleQuery,
          false,
          client
        )({
          username: data.username,
        })
      : Promise.resolve(undefined),
    // Check email
    data.email !== undefined
      ? service(
          usersServices.getSingleQuery,
          false,
          client
        )({
          email: data.email,
        })
      : Promise.resolve(undefined),
  ]);

  if (usernameCheck !== undefined || emailCheck !== undefined) {
    const errors: ErrorResult = {};
    if (emailCheck) {
      errors.email = {
        code: "email_already_exists",
        message: "A user with that email already exists.",
      };
    }
    if (usernameCheck) {
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

  let hashedPassword = undefined;
  if (data.password) {
    hashedPassword = await argon2.hash(data.password);
  }

  let superAdmin = data.super_admin;
  if (current_user_id !== undefined && superAdmin !== undefined) {
    const currentUser = await service(
      usersServices.getSingle,
      false,
      client
    )({
      user_id: current_user_id,
    });

    if (!currentUser.super_admin) {
      superAdmin = undefined;
    }
  }

  // -------------------------------------------
  // Update User
  const userUpdate = await User.updateSingle(client, {
    user_id: data.user_id,
    first_name: data.first_name,
    last_name: data.last_name,
    username: data.username,
    email: data.email,
    password: hashedPassword,
    super_admin: superAdmin,
  });

  if (!userUpdate) {
    throw new LucidError({
      type: "basic",
      name: "User Not Updated",
      message: "The user was not updated.",
      status: 500,
    });
  }

  // -------------------------------------------
  // Update Roles
  if (data.role_ids) {
    await service(
      usersServices.updateRoles,
      false,
      client
    )({
      user_id: data.user_id,
      role_ids: data.role_ids,
    });
  }

  // -------------------------------------------
  // Return User
  return undefined;
};

export default updateSingle;
