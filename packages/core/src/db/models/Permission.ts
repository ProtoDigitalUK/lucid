import sql from "@db/db";
// import { LucidError, modelErrors } from "@utils/error-handler";

// -------------------------------------------
// Types
type PermissionNames = "manage_users" | "manage_content" | "manage_settings";
type PermissionRoles = "admin" | "editor";

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
  static set = async (user_id: string, role: PermissionRoles) => {
    const permissions = Permission.rolePermissions(role);

    const [permission]: [PermissionT?] = await sql`
        SELECT * FROM lucid_permissions WHERE user_id = ${user_id}
        `;
    if (!permission) {
      await sql`
        INSERT INTO lucid_permissions (user_id, permissions)
        VALUES (${user_id}, ${permissions})
        `;
    } else {
      await sql`
        UPDATE lucid_permissions
        SET permissions = ${permissions}
        WHERE user_id = ${user_id}
        `;
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
