import argon2 from "argon2";
import sql from "@db/db";
import omitUndefinedKeys from "@utils/omit-undedefined-keys";
import { LucidError, modelErrors } from "@utils/error-handler";

// -------------------------------------------
// Types

type UserRegister = (data: {
  email: string;
  username: string;
  password: string;
  account_reset?: boolean;
}) => Promise<UserT[]>;

type UserAccountReset = (
  id: string,
  data: {
    email: string;
    password: string;
    username?: string;
  }
) => Promise<UserT[]>;

type UserGetById = (id: string) => Promise<UserT[]>;

type UserLogin = (username: string, password: string) => Promise<UserT[]>;

// -------------------------------------------
// User
export type UserT = {
  id: string;
  email: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  password?: string;
  account_reset: boolean;
  created_at: string;
  updated_at: string;
};

export default class User {
  // -------------------------------------------
  // Methods
  static register: UserRegister = async (data) => {
    const { email, username, password, account_reset } = data;

    // check if user exists
    await User.checkIfUserExistsAlready(email, username);

    // hash password
    const hashedPassword = await argon2.hash(password);

    const updateData = omitUndefinedKeys({
      email,
      username,
      password: hashedPassword,
      account_reset,
    }) as typeof data;

    // create user
    const user = await sql<UserT[]>`
        INSERT INTO lucid_users
        ${sql(updateData)}
        RETURNING *
        `;

    if (user.length === 0) {
      throw new LucidError({
        type: "basic",
        name: "User Not Created",
        message: "There was an error creating the user.",
        status: 500,
      });
    }

    delete user[0].password;
    return user;
  };
  static accountReset: UserAccountReset = async (id, data) => {
    const { email, username, password } = data;

    const user = await User.getById(id);

    if (!user[0].account_reset) {
      throw new LucidError({
        type: "basic",
        name: "Account Reset Not Allowed",
        message: "Account reset is not allowed for this user.",
        status: 400,
        errors: modelErrors({
          account_reset: {
            code: "account_reset_not_allowed",
            message: "Account reset is not allowed for this user.",
          },
        }),
      });
    }

    // hash password
    const hashedPassword = await argon2.hash(password);

    const updateData = omitUndefinedKeys({
      email,
      username,
      password: hashedPassword,
      account_reset: false,
    }) as {
      email: string;
      username: string;
      password: string;
      account_reset: boolean;
    };

    const updatedUser = await sql<UserT[]>`
        UPDATE lucid_users
        SET
        ${sql(updateData)}
        WHERE id = ${id}
        RETURNING *
        `;

    if (updatedUser.length === 0) {
      throw new LucidError({
        type: "basic",
        name: "User Not Updated",
        message: "There was an error updating the user.",
        status: 500,
      });
    }

    delete updatedUser[0].password;
    return updatedUser;
  };
  static getById: UserGetById = async (id) => {
    const user = await sql<UserT[]>`
        SELECT * FROM lucid_users WHERE id = ${id}
        `;
    if (user.length === 0) {
      throw new LucidError({
        type: "basic",
        name: "User Not Found",
        message: "There was an error finding the user.",
        status: 500,
        errors: modelErrors({
          id: {
            code: "user_not_found",
            message: "There was an error finding the user.",
          },
        }),
      });
    }

    delete user[0].password;
    return user;
  };
  static login: UserLogin = async (username, password) => {
    // double submit cooki - csrf protection
    // https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#double-submit-cookie

    const user = await sql<UserT[]>`
        SELECT * FROM lucid_users WHERE username = ${username}
        `;

    if (user.length === 0 || !user[0].password) {
      throw new LucidError({
        type: "basic",
        name: "User Not Found",
        message: "The email or password you entered is incorrect.",
        status: 500,
      });
    }

    const passwordValid = await argon2.verify(user[0].password, password);

    if (!passwordValid) {
      throw new LucidError({
        type: "basic",
        name: "User Not Found",
        message: "The email or password you entered is incorrect.",
        status: 500,
      });
    }

    delete user[0].password;
    return user;
  };
  // -------------------------------------------
  // Util Methods
  static checkIfUserExistsAlready = async (email: string, username: string) => {
    const withEmail = await sql<UserT[]>`
        SELECT * FROM lucid_users WHERE email = ${email}
        `;
    if (withEmail.length > 0) {
      throw new LucidError({
        type: "basic",
        name: "User Already Exists",
        message: "A user with that email already exists.",
        status: 400,
        errors: modelErrors({
          email: {
            code: "email_already_exists",
            message: "A user with that email already exists.",
          },
        }),
      });
    }

    const withUsername = await sql<UserT[]>`
        SELECT * FROM lucid_users WHERE username = ${username}
        `;
    if (withUsername.length > 0) {
      throw new LucidError({
        type: "basic",
        name: "User Already Exists",
        message: "A user with that username already exists.",
        status: 400,
        errors: modelErrors({
          username: {
            code: "username_already_exists",
            message: "A user with that username already exists.",
          },
        }),
      });
    }
  };
}
