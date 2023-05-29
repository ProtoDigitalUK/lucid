import argon2 from "argon2";
import client from "@db/db";
import { LucidError, modelErrors } from "@utils/error-handler";

// -------------------------------------------
// Types

type UserRegister = (data: {
  email: string;
  username: string;
  password: string;
  account_reset?: boolean;
}) => Promise<UserT>;

type UserAccountReset = (
  id: string,
  data: {
    email: string;
    password: string;
    username?: string;
  }
) => Promise<UserT>;

type UserGetById = (id: string) => Promise<UserT>;

type UserLogin = (username: string, password: string) => Promise<UserT>;

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

    const user = await client.query<UserT>({
      text: `INSERT INTO lucid_users (email, username, password, account_reset) VALUES ($1, $2, $3, $4) RETURNING *`,
      values: [email, username, hashedPassword, account_reset || false],
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
  static accountReset: UserAccountReset = async (id, data) => {
    const { email, username, password } = data;

    const user = await User.getById(id);

    if (!user.account_reset) {
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

    const updatedUser = await client.query<UserT>({
      text: `UPDATE lucid_users SET email = $1, username = $2, password = $3, account_reset = $4 WHERE id = $5 RETURNING *`,
      values: [email, username, hashedPassword, false, id],
    });

    if (!updatedUser.rows[0]) {
      throw new LucidError({
        type: "basic",
        name: "User Not Updated",
        message: "There was an error updating the user.",
        status: 500,
      });
    }

    delete updatedUser.rows[0].password;
    return updatedUser.rows[0];
  };
  static getById: UserGetById = async (id) => {
    const user = await client.query<UserT>({
      text: `SELECT * FROM lucid_users WHERE id = $1`,
      values: [id],
    });

    if (!user.rows[0]) {
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

    delete user.rows[0].password;
    return user.rows[0];
  };
  static login: UserLogin = async (username, password) => {
    // double submit cooki - csrf protection
    // https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#double-submit-cookie
    const user = await client.query<UserT>({
      text: `SELECT * FROM lucid_users WHERE username = $1`,
      values: [username],
    });

    if (!user.rows[0] || !user.rows[0].password) {
      throw new LucidError({
        type: "basic",
        name: "User Not Found",
        message: "The email or password you entered is incorrect.",
        status: 500,
      });
    }

    const passwordValid = await argon2.verify(user.rows[0].password, password);

    if (!passwordValid) {
      throw new LucidError({
        type: "basic",
        name: "User Not Found",
        message: "The email or password you entered is incorrect.",
        status: 500,
      });
    }

    delete user.rows[0].password;
    return user.rows[0];
  };
  // -------------------------------------------
  // Util Methods
  static checkIfUserExistsAlready = async (email: string, username: string) => {
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
}
