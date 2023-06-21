import client from "@db/db";
// Utils
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
  | "update_settings"
  | "update_environment"
  | "migrate_environment";

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
  | `delete_menu`;

type RolePermissionCreateMultiple = (
  role_id: number,
  permissions: Array<{
    permission: PermissionT | EnvironmentPermissionT;
    environment_key?: string;
  }>
) => Promise<RolePermissionT[]>;

type RolePermissionDeleteMultiple = (
  id: RolePermissionT["id"][]
) => Promise<RolePermissionT[]>;

type RolePermissionGetAll = (role_id: number) => Promise<RolePermissionT[]>;

type RolePermissionDeleteAll = (role_id: number) => Promise<RolePermissionT[]>;

// -------------------------------------------
// User
export type RolePermissionT = {
  id: number;
  role_id: string;
  permission: PermissionT | EnvironmentPermissionT;
  environment_key: string | null;

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
  static deleteMultiple: RolePermissionDeleteMultiple = async (ids) => {
    const permissionsPromise = ids.map((id) => {
      return client.query<RolePermissionT>({
        text: `DELETE FROM lucid_role_permissions WHERE id = $1 RETURNING *`,
        values: [id],
      });
    });

    const permissionsRes = await Promise.all(permissionsPromise);
    const permissionsData = permissionsRes.map(
      (permission) => permission.rows[0]
    );
    return permissionsData;
  };
  static deleteAll: RolePermissionDeleteAll = async (role_id) => {
    const res = await client.query<RolePermissionT>({
      text: `DELETE FROM lucid_role_permissions WHERE role_id = $1 RETURNING *`,
      values: [role_id],
    });
    return res.rows;
  };
  static getAll: RolePermissionGetAll = async (role_id) => {
    const res = await client.query<RolePermissionT>({
      text: `SELECT * FROM lucid_role_permissions WHERE role_id = $1`,
      values: [role_id],
    });
    return res.rows;
  };
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
        // Environment Management
        "update_environment",
        "migrate_environment",
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
      ],
    };
  }
}
