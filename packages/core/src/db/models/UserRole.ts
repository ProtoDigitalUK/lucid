import getDBClient from "@db/db";
// Utils
import { LucidError } from "@utils/app/error-handler";
// Services
import roleServices from "@services/roles";
import usersServices from "@services/users";

// -------------------------------------------
// Types
type UserRoleGetAll = (user_id: number) => Promise<UserRoleT[]>;

type UserRoleUpdate = (
  id: number,
  data: {
    role_ids: number[];
  }
) => Promise<UserRoleT[]>;

type UserRoleGetPermissions = (
  user_id: number
) => Promise<UserRolePermissionRes[]>;

type UserRoleDeleteMultiple = (
  user_id: number,
  role_ids: number[]
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
  // -------------------------------------------
  // Functions
  static getAll: UserRoleGetAll = async (user_id) => {
    const client = await getDBClient;

    // Get all users roles
    const userRoles = await client.query<UserRoleT>({
      text: `
        SELECT * FROM lucid_user_roles
        WHERE user_id = $1
      `,
      values: [user_id],
    });

    return userRoles.rows;
  };
  static updateRoles: UserRoleUpdate = async (user_id, data) => {
    const client = await getDBClient;

    const roles = await client.query<UserRoleT>({
      text: `
        INSERT INTO lucid_user_roles(user_id, role_id)
        SELECT $1, unnest($2::integer[]);`,
      values: [user_id, data.role_ids],
    });

    return roles.rows;
  };
  static deleteMultiple: UserRoleDeleteMultiple = async (user_id, role_ids) => {
    const client = await getDBClient;

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
      values: [role_ids, user_id],
    });

    return roles.rows;
  };
  static getPermissions: UserRoleGetPermissions = async (user_id) => {
    const client = await getDBClient;

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
      values: [user_id],
    });

    return userPermissions.rows;
  };
}
