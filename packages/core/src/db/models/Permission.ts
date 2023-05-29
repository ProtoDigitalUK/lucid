import client from "@db/db";
import { LucidError } from "@utils/error-handler";

// -------------------------------------------
// Types
type PermissionNames = "manage_users" | "manage_content" | "manage_settings";
type PermissionRoles = "admin" | "editor";

type PermissionSet = (
  user_id: string,
  role: PermissionRoles
) => Promise<PermissionT>;

// -------------------------------------------
// User
export type PermissionT = {
  id: string;
  user_id: string;
  permissions: PermissionNames[];
  created_at: string;
  updated_at: string;
};

export default class Permission {
  // -------------------------------------------
  // Methods
  static set: PermissionSet = async (user_id, role) => {
    const permissions = Permission.rolePermissions(role);

    const permission = await client.query<PermissionT>({
      text: `SELECT * FROM lucid_permissions WHERE user_id = $1`,
      values: [user_id],
    });

    if (!permission.rows[0]) {
      const permRes = await client.query<PermissionT>({
        text: `INSERT INTO lucid_permissions (user_id, permissions) VALUES ($1, $2) RETURNING *`,
        values: [user_id, permissions],
      });

      if (!permRes.rows[0]) {
        throw new LucidError({
          type: "basic",
          name: "Permission Error",
          message: "There was an error setting the permissions.",
          status: 500,
        });
      }
      return permRes.rows[0];
    } else {
      const permRes = await client.query<PermissionT>({
        text: `UPDATE lucid_permissions SET permissions = $1 WHERE user_id = $2 RETURNING *`,
        values: [permissions, user_id],
      });

      if (!permRes.rows[0]) {
        throw new LucidError({
          type: "basic",
          name: "Permission Error",
          message: "There was an error setting the permissions.",
          status: 500,
        });
      }
      return permRes.rows[0];
    }
  };
  // -------------------------------------------
  // Util Methods
  static rolePermissions = (role: PermissionRoles) => {
    switch (role) {
      case "admin":
        return ["manage_users", "manage_content", "manage_settings"];
      case "editor":
        return ["manage_content"];
      default:
        return [];
    }
  };
}
