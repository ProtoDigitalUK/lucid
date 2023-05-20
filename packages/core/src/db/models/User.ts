import argon2 from "argon2";
import sql from "@db/db";
import { LucidError, modelErrors } from "@utils/error-handler";

// -------------------------------------------
// Types
interface UserRegisterT {
  email: string;
  username: string;
  password: string;
}

// -------------------------------------------
// User
export type UserT = {
  id: string;
  email: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  password: string;
  created_at: string;
  updated_at: string;
};

export default class User {
  // -------------------------------------------
  // Methods
  static register = async (data: UserRegisterT) => {
    const { email, username, password } = data;

    // check if user exists
    await User.checkIfUserExists(email, username);

    // hash password
    const hashedPassword = await argon2.hash(password);

    // create user
    const [user]: [UserT] = await sql`
        INSERT INTO lucid_users
        (email, username, password)
        VALUES
        (${email}, ${username}, ${hashedPassword})
        RETURNING *
        `;

    if (!user) {
      throw new LucidError({
        type: "basic",
        name: "User Not Created",
        message: "There was an error creating the user.",
        status: 500,
      });
    }

    return user;
  };
  // -------------------------------------------
  // Util Methods
  static checkIfUserExists = async (email: string, username: string) => {
    const [withEmail]: [User?] = await sql`
        SELECT * FROM lucid_users WHERE email = ${email}
        `;
    if (withEmail) {
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

    const [withUsername]: [User?] = await sql`
        SELECT * FROM lucid_users WHERE username = ${username}
        `;
    if (withUsername) {
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
