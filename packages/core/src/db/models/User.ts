import argon2 from "argon2";
import getDBClient from "@db/db";
// Models
import Option from "@db/models/Option";
// Utils
import {
  UserRoleRes,
  UserEnvrionmentRes,
} from "@utils/users/format-permissions";
import { LucidError, modelErrors } from "@utils/app/error-handler";
import { queryDataFormat } from "@utils/app/query-helpers";
// Services
import { PermissionT } from "@services/permissions";

// -------------------------------------------
// Types
type UserRegister = (data: {
  email: string;
  username: string;
  password: string;
  super_admin?: boolean;
}) => Promise<UserT>;

type UserGetById = (id: number) => Promise<UserT>;

type UserLogin = (data: { username: string }) => Promise<UserT>;

type UserUpdateSingle = (id: number, data: {}) => Promise<UserT>;

// -------------------------------------------
// User
export type UserT = {
  id: number;
  super_admin: boolean;
  email: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  password?: string;

  roles?: UserRoleRes[];
  permissions?: {
    global: PermissionT[];
    environments?: UserEnvrionmentRes[];
  };

  created_at: string;
  updated_at: string;
};

export default class User {
  // -------------------------------------------
  // Functions
  static register: UserRegister = async (data) => {
    const client = await getDBClient;

    const { email, username, password, super_admin } = data;

    // check if user exists
    await User.checkIfUserExistsAlready(email, username);

    // hash password
    const hashedPassword = await argon2.hash(password);

    const { columns, aliases, values } = queryDataFormat({
      columns: ["email", "username", "password", "super_admin"],
      values: [email, username, hashedPassword, super_admin],
    });

    const user = await client.query<UserT>({
      text: `INSERT INTO lucid_users (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
      values: values.value,
    });

    if (!user.rows[0]) {
      throw new LucidError({
        type: "basic",
        name: "User Not Created",
        message: "There was an error creating the user.",
        status: 500,
      });
    }

    delete user.rows[0].password;
    return user.rows[0];
  };
  static registerSuperAdmin: UserRegister = async (data) => {
    const user = await User.register({ ...data, super_admin: true });
    await Option.patchByName({
      name: "initial_user_created",
      value: true,
      type: "boolean",
    });

    return user;
  };
  static getById: UserGetById = async (id) => {
    const client = await getDBClient;

    const user = await client.query<UserT>({
      text: `SELECT * FROM lucid_users WHERE id = $1`,
      values: [id],
    });

    return user.rows[0];
  };
  static login: UserLogin = async (data) => {
    const client = await getDBClient;

    const user = await client.query<UserT>({
      text: `SELECT * FROM lucid_users WHERE username = $1`,
      values: [data.username],
    });

    return user.rows[0];
  };
  static updateSingle: UserUpdateSingle = async (id, data) => {
    return {} as UserT;
  };
  // -------------------------------------------
  // Util Functions
  static checkIfUserExistsAlready = async (email: string, username: string) => {
    const client = await getDBClient;

    const userExists = await client.query<UserT>({
      text: `SELECT * FROM lucid_users WHERE email = $1 OR username = $2`,
      values: [email, username],
    });

    if (userExists.rows[0]) {
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
  };
  static validatePassword = async (
    hashedPassword: string,
    password: string
  ) => {
    return await argon2.verify(hashedPassword, password);
  };
}
