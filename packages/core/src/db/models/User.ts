import { PoolClient } from "pg";
// Utils
import { queryDataFormat, SelectQueryBuilder } from "@utils/app/query-helpers";

// -------------------------------------------
// Types
type UserGetMultiple = (
  client: PoolClient,
  query_instance: SelectQueryBuilder
) => Promise<{
  data: UserT[];
  count: number;
}>;

type UserRegister = (
  client: PoolClient,
  data: {
    first_name?: string;
    last_name?: string;
    email: string;
    username: string;
    password: string;
    super_admin?: boolean;
  }
) => Promise<UserT>;

type UserGetById = (
  client: PoolClient,
  data: {
    id: number;
  }
) => Promise<UserT>;

type UserGetByUsername = (
  client: PoolClient,
  data: { username: string }
) => Promise<UserT>;

type UserGetByEmail = (
  client: PoolClient,
  data: { email: string }
) => Promise<UserT>;

type UserGetByEmailAndUsername = (
  client: PoolClient,
  data: { email: string; username: string }
) => Promise<UserT>;

type UserDeleteSingle = (
  client: PoolClient,
  data: { id: number }
) => Promise<UserT>;

type UserUpdatePassword = (
  client: PoolClient,
  data: {
    id: number;
    password: string;
  }
) => Promise<UserT>;

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
  static register: UserRegister = async (client, data) => {
    const { columns, aliases, values } = queryDataFormat({
      columns: [
        "email",
        "username",
        "password",
        "super_admin",
        "first_name",
        "last_name",
      ],
      values: [
        data.email,
        data.username,
        data.password,
        data.super_admin,
        data.first_name,
        data.last_name,
      ],
    });

    const user = await client.query<UserT>({
      text: `INSERT INTO lucid_users (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
      values: values.value,
    });

    return user.rows[0];
  };
  static getMultiple: UserGetMultiple = async (client, query_instance) => {
    const users = client.query<UserT>({
      text: `SELECT ${query_instance.query.select} FROM lucid_users ${query_instance.query.where} ${query_instance.query.order} ${query_instance.query.pagination}`,
      values: query_instance.values,
    });

    const count = client.query<{ count: string }>({
      text: `SELECT COUNT(DISTINCT lucid_users.id) FROM lucid_users ${query_instance.query.where}`,
      values: query_instance.countValues,
    });

    const data = await Promise.all([users, count]);

    return {
      data: data[0].rows,
      count: parseInt(data[1].rows[0].count),
    };
  };
  static getById: UserGetById = async (client, data) => {
    const user = await client.query<UserT>({
      text: `SELECT * FROM lucid_users WHERE id = $1`,
      values: [data.id],
    });

    return user.rows[0];
  };
  static getByUsername: UserGetByUsername = async (client, data) => {
    const user = await client.query<UserT>({
      text: `SELECT * FROM lucid_users WHERE username = $1`,
      values: [data.username],
    });

    return user.rows[0];
  };
  static getByEmail: UserGetByEmail = async (client, data) => {
    const user = await client.query<UserT>({
      text: `SELECT * FROM lucid_users WHERE email = $1`,
      values: [data.email],
    });

    return user.rows[0];
  };
  static getByEmailAndUsername: UserGetByEmailAndUsername = async (
    client,
    data
  ) => {
    const userExists = await client.query<UserT>({
      text: `SELECT * FROM lucid_users WHERE email = $1 OR username = $2`,
      values: [data.email, data.username],
    });

    return userExists.rows[0];
  };
  static deleteSingle: UserDeleteSingle = async (client, data) => {
    const user = await client.query<UserT>({
      text: `DELETE FROM lucid_users WHERE id = $1 RETURNING *`,
      values: [data.id],
    });

    return user.rows[0];
  };
  static updatePassword: UserUpdatePassword = async (client, data) => {
    const user = await client.query<UserT>({
      text: `UPDATE lucid_users SET password = $1 WHERE id = $2 RETURNING *`,
      values: [data.password, data.id],
    });

    return user.rows[0];
  };
}
