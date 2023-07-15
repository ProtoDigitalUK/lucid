import { PoolClient } from "pg";

// -------------------------------------------
// Types
type UserRoleGetAll = (
  client: PoolClient,
  data: {
    user_id: number;
  }
) => Promise<UserRoleT[]>;

type UserRoleUpdate = (
  client: PoolClient,
  data: {
    user_id: number;
    role_ids: number[];
  }
) => Promise<UserRoleT[]>;

type UserRoleGetPermissions = (
  client: PoolClient,
  data: {
    user_id: number;
  }
) => Promise<UserRolePermissionRes[]>;

type UserRoleDeleteMultiple = (
  client: PoolClient,
  data: {
    user_id: number;
    role_ids: number[];
  }
) => Promise<UserRoleT[]>;

// -------------------------------------------
// Interfaces
export interface UserRolePermissionRes {
  permission: string;
  environment_key: string;
  role_id: number;
  role_name: string;
}

// -------------------------------------------
// User Roles
export type UserRoleT = {
  id: number;
  user_id: number;
  role_id: number;

  created_at: string;
  updated_at: string;
};

export default class UserRole {
  static getAll: UserRoleGetAll = async (client, data) => {
    const userRoles = await client.query<UserRoleT>({
      text: `
        SELECT * FROM lucid_user_roles
        WHERE user_id = $1
      `,
      values: [data.user_id],
    });

    return userRoles.rows;
  };
  static updateRoles: UserRoleUpdate = async (client, data) => {
    const roles = await client.query<UserRoleT>({
      text: `
        INSERT INTO lucid_user_roles(user_id, role_id)
        SELECT $1, unnest($2::integer[]);`,
      values: [data.user_id, data.role_ids],
    });

    return roles.rows;
  };
  static deleteMultiple: UserRoleDeleteMultiple = async (client, data) => {
    const roles = await client.query<UserRoleT>({
      text: `
        DELETE FROM 
          lucid_user_roles
        WHERE 
          id = ANY($1::integer[])
        AND 
          user_id = $2
        RETURNING *;
      `,
      values: [data.role_ids, data.user_id],
    });

    return roles.rows;
  };
  static getPermissions: UserRoleGetPermissions = async (client, data) => {
    const userPermissions = await client.query<UserRolePermissionRes>({
      text: `SELECT 
          rp.permission,
          rp.environment_key,
          r.id AS role_id,
          r.name AS role_name
        FROM 
          lucid_role_permissions rp
        INNER JOIN 
          lucid_user_roles ur ON ur.role_id = rp.role_id
        INNER JOIN 
          lucid_roles r ON r.id = rp.role_id
        WHERE 
          ur.user_id = $1;`,
      values: [data.user_id],
    });

    return userPermissions.rows;
  };
}
