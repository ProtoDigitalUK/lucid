import client from "@db/db";
// Utils
import { LucidError, modelErrors } from "@utils/error-handler";
import { queryDataFormat } from "@utils/query-helpers";

// -------------------------------------------
// Types
export type PermissionT =
  | "create_user"
  | "read_user"
  | "update_user"
  | "delete_user"
  | "create_role"
  | "read_role"
  | "update_role"
  | "delete_role"
  | "assign_role"
  | "create_media"
  | "read_media"
  | "update_media"
  | "delete_media"
  | "update_settings";

export type EnvironmentPermissionT =
  | `create_content`
  | `read_content`
  | `update_content`
  | `delete_content`
  | `publish_content`
  | `unpublish_content`
  | `create_category`
  | `update_category`
  | `delete_category`
  | `create_menu`
  | `read_menu`
  | `update_menu`
  | `delete_menu`
  | "view_environment"
  | "update_environment"
  | "migrate_environment";

type RolePermissionCreateMultiple = (
  role_id: number,
  permissions: Array<{
    permission: PermissionT | EnvironmentPermissionT;
    environment_key?: string;
  }>
) => Promise<RolePermissionT[]>;

// -------------------------------------------
// User
export type RolePermissionT = {
  id: number;
  role_id: string;
  permission: string;

  created_at: string;
  updated_at: string;
};

export default class RolePermission {
  // -------------------------------------------
  // Functions
  static createMultiple: RolePermissionCreateMultiple = async (
    role_id,
    permissions
  ) => {
    const permissionsPromise = permissions.map((permission) => {
      const { columns, aliases, values } = queryDataFormat(
        ["role_id", "permission", "environment_key"],
        [role_id, permission.permission, permission.environment_key]
      );

      return client.query<RolePermissionT>({
        text: `INSERT INTO lucid_role_permissions (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
        values: values.value,
      });
    });

    const permissionsRes = await Promise.all(permissionsPromise);
    const permissionsData = permissionsRes.map(
      (permission) => permission.rows[0]
    );
    return permissionsData;
  };
  // -------------------------------------------
  // Util Functions
  // -------------------------------------------
  // Getters
  static get permissions(): {
    global: PermissionT[];
    environment: EnvironmentPermissionT[];
  } {
    return {
      global: [
        // Users
        "create_user",
        "read_user",
        "update_user",
        "delete_user",
        // Roles
        "create_role",
        "read_role",
        "update_role",
        "delete_role",
        "assign_role",
        // Media
        "create_media",
        "read_media",
        "update_media",
        "delete_media",
        // Settings
        "update_settings",
      ],
      environment: [
        // Content
        `create_content`,
        `read_content`,
        `update_content`,
        `delete_content`,
        `publish_content`,
        `unpublish_content`,
        // Categories
        `create_category`,
        `update_category`,
        `delete_category`,
        // Menus
        `create_menu`,
        `read_menu`,
        `update_menu`,
        `delete_menu`,
        // Environment Management
        "view_environment",
        "update_environment",
        "migrate_environment",
      ],
    };
  }
}
