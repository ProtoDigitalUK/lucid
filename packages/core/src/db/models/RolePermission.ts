import getDBClient from "@db/db";
// Utils
import { queryDataFormat } from "@utils/app/query-helpers";

// -------------------------------------------
// Types
type PermissionUsers =
  | "create_user"
  | "read_user"
  | "update_user"
  | "delete_user";
type PermissionRoles =
  | "create_role"
  | "read_role"
  | "update_role"
  | "delete_role"
  | "assign_role";
type PermissionMedia =
  | "create_media"
  | "read_media"
  | "update_media"
  | "delete_media";
type PermissionSettings = "update_settings";
type PermissionEnvironment =
  | "update_environment"
  | "migrate_environment"
  | "delete_environment"
  | "create_environment";
type PermissionEmails = "read_email" | "delete_email" | "send_email";
// env permissions
type PermissionContent =
  | "create_content"
  | "read_content"
  | "update_content"
  | "delete_content"
  | "publish_content"
  | "unpublish_content";
type PermissionCategory =
  | "create_category"
  | "read_category"
  | "update_category"
  | "delete_category";
type PermissionMenu =
  | "create_menu"
  | "read_menu"
  | "update_menu"
  | "delete_menu";
type PermissionFormSubmissions =
  | "read_form_submissions"
  | "delete_form_submissions"
  | "update_form_submissions";

// Type Categories
export type PermissionT =
  | PermissionUsers
  | PermissionRoles
  | PermissionMedia
  | PermissionSettings
  | PermissionEnvironment
  | PermissionEmails;

export type EnvironmentPermissionT =
  | PermissionContent
  | PermissionCategory
  | PermissionMenu
  | PermissionFormSubmissions;

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
    const client = await getDBClient;

    const permissionsPromise = permissions.map((permission) => {
      const { columns, aliases, values } = queryDataFormat({
        columns: ["role_id", "permission", "environment_key"],
        values: [role_id, permission.permission, permission.environment_key],
      });

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
    const client = await getDBClient;

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
    const client = await getDBClient;

    const res = await client.query<RolePermissionT>({
      text: `DELETE FROM lucid_role_permissions WHERE role_id = $1 RETURNING *`,
      values: [role_id],
    });
    return res.rows;
  };
  static getAll: RolePermissionGetAll = async (role_id) => {
    const client = await getDBClient;

    const res = await client.query<RolePermissionT>({
      text: `SELECT * FROM lucid_role_permissions WHERE role_id = $1`,
      values: [role_id],
    });
    return res.rows;
  };
}
