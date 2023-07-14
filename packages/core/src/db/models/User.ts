import getDBClient from "@db/db";
// Utils
import { queryDataFormat } from "@utils/app/query-helpers";

// -------------------------------------------
// Types
type UserRegister = (data: {
  email: string;
  username: string;
  password: string;
  super_admin?: boolean;
}) => Promise<UserT>;

type UserGetById = (id: number) => Promise<UserT>;

type UserGetByUsername = (data: { username: string }) => Promise<UserT>;

type UserGetByEmail = (data: { email: string }) => Promise<UserT>;

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

  created_at: string;
  updated_at: string;
};

export default class User {
  static register: UserRegister = async (data) => {
    const client = await getDBClient;

    const { columns, aliases, values } = queryDataFormat({
      columns: ["email", "username", "password", "super_admin"],
      values: [data.email, data.username, data.password, data.super_admin],
    });

    const user = await client.query<UserT>({
      text: `INSERT INTO lucid_users (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
      values: values.value,
    });

    return user.rows[0];
  };
  static getById: UserGetById = async (id) => {
    const client = await getDBClient;

    const user = await client.query<UserT>({
      text: `SELECT * FROM lucid_users WHERE id = $1`,
      values: [id],
    });

    return user.rows[0];
  };
  static getByUsername: UserGetByUsername = async (data) => {
    const client = await getDBClient;

    const user = await client.query<UserT>({
      text: `SELECT * FROM lucid_users WHERE username = $1`,
      values: [data.username],
    });

    return user.rows[0];
  };
  static getByEmail: UserGetByEmail = async (data) => {
    const client = await getDBClient;

    const user = await client.query<UserT>({
      text: `SELECT * FROM lucid_users WHERE email = $1`,
      values: [data.email],
    });

    return user.rows[0];
  };
  static checkIfUserExistsAlready = async (email: string, username: string) => {
    const client = await getDBClient;

    const userExists = await client.query<UserT>({
      text: `SELECT * FROM lucid_users WHERE email = $1 OR username = $2`,
      values: [email, username],
    });

    return userExists.rows[0];
  };
}
