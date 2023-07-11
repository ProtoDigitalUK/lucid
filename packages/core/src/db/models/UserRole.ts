import getDBClient from "@db/db";
// Models
import Role from "@db/models/Role";
// Utils
import formatPermissions from "@utils/users/format-permissions";
import { LucidError } from "@utils/app/error-handler";
// Services
import roleServices from "@services/roles";

// -------------------------------------------
// Types
type UserRoleUpdate = (
  id: number,
  data: {
    role_ids: number[];
  }
) => Promise<UserRoleT[]>;

type UserRoleGetPermissions = (
  id: number
) => Promise<ReturnType<typeof formatPermissions>>;

// -------------------------------------------
// Interfaces
export interface UserRolePermissionRes {
  permission: string;
  environment_key: string;
  role_id: number;
  role_name: string;
}

// -------------------------------------------
// User
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
  static update: UserRoleUpdate = async (id, data) => {
    const client = await getDBClient;

    // Get all users roles
    const userRoles = await client.query<UserRoleT>({
      text: `
        SELECT * FROM lucid_user_roles
        WHERE user_id = $1
      `,
      values: [id],
    });
    // Add roles that don't exist to the user
    const newRoles = data.role_ids.filter((role) => {
      return !userRoles.rows.find((userRole) => userRole.role_id === role);
    });

    // Add the new roles to the user
    if (newRoles.length > 0) {
      const rolesRes = await roleServices.getMultiple({
        query: {
          filter: {
            role_ids: newRoles.map((role) => role.toString()),
          },
        },
      });
      if (rolesRes.count !== newRoles.length) {
        throw new LucidError({
          type: "basic",
          name: "Role Error",
          message: "One or more of the roles do not exist.",
          status: 500,
        });
      }

      await client.query<UserRoleT>({
        text: `
          INSERT INTO lucid_user_roles(user_id, role_id)
          SELECT $1, unnest($2::integer[]);`,
        values: [id, newRoles],
      });
    }

    // Remove the other roles from the user
    const rolesToRemove = userRoles.rows.filter((userRole) => {
      return !data.role_ids.find((role) => role === userRole.role_id);
    });

    if (rolesToRemove.length > 0) {
      const rolesToRemoveIds = rolesToRemove.map((role) => role.id);

      await client.query<UserRoleT>({
        text: `
          DELETE FROM lucid_user_roles
          WHERE id IN (${rolesToRemoveIds.join(",")})
        `,
      });
    }

    // Return the updated user roles
    const updatedUserRoles = await client.query<UserRoleT>({
      text: `
        SELECT * FROM lucid_user_roles
        WHERE user_id = $1
      `,
      values: [id],
    });

    return updatedUserRoles.rows;
  };
  static getPermissions: UserRoleGetPermissions = async (id) => {
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
      values: [id],
    });

    if (!userPermissions.rows) {
      return {
        roles: [],
        permissions: {
          global: [],
          environments: [],
        },
      };
    }

    const formattedPermissions = formatPermissions(userPermissions.rows);
    return formattedPermissions;
  };
}
