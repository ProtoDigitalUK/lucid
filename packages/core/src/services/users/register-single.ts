import argon2 from "argon2";
// Utils
import { LucidError, modelErrors, ErrorResult } from "@utils/app/error-handler";
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

const registerSingle = async (data: ServiceData, current_user_id?: number) => {
  let superAdmin = data.super_admin;

  // --------------------------------------------------
  // check if user exists
  const checkUserProm = Promise.all([
    User.getByEmail({
      email: data.email,
    }),
    User.getByUsername({
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

  await usersServices.checkIfUserExists({
    email: data.email,
    username: data.username,
  });

  // --------------------------------------------------
  // Get the current user and only allow them to create super admins if they are a super admin

  if (current_user_id !== undefined) {
    const currentUser = await usersServices.getSingle({
      user_id: current_user_id,
    });
    if (!currentUser.super_admin) {
      superAdmin = false;
    }
  }

  const hashedPassword = await argon2.hash(data.password);

  // --------------------------------------------------
  // Create the user
  const user = await User.register({
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
  try {
    if (data.role_ids && data.role_ids.length > 0) {
      await usersServices.updateRoles({
        user_id: user.id,
        role_ids: data.role_ids,
      });
    }
  } catch (err) {
    await User.deleteSingle(user.id);
    throw err;
  }
  // --------------------------------------------------
  // Get the user permissions and return the user
  const userPermissions = await usersServices.getPermissions({
    user_id: user.id,
  });

  return formatUser(user, userPermissions);
};

export default registerSingle;
