import client from "@db/db";
// Utils
import { queryDataFormat } from "@utils/query-helpers";

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
type PermissionEnvironment = "update_environment" | "migrate_environment";
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

// Type Categories
export type PermissionT =
  | PermissionUsers
  | PermissionRoles
  | PermissionMedia
  | PermissionSettings
  | PermissionEnvironment;

export type EnvironmentPermissionT =
  | PermissionContent
  | PermissionCategory
  | PermissionMenu;

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
  static get getValidPermissions() {
    return {
      global: {
        users: {
          title: "Users",
          permissions: RolePermission.userPermissions,
        },
        roles: {
          title: "Roles",
          permissions: RolePermission.rolePermissions,
        },
        media: {
          title: "Media",
          permissions: RolePermission.mediaPermissions,
        },
        settings: {
          title: "Settings",
          permissions: RolePermission.settingsPermissions,
        },
        environment: {
          title: "Environment",
          permissions: RolePermission.environmentPermissions,
        },
      },
      environment: {
        content: {
          title: "Content",
          permissions: RolePermission.contentPermissions,
        },
        category: {
          title: "Category",
          permissions: RolePermission.categoryPermissions,
        },
        menu: {
          title: "Menu",
          permissions: RolePermission.menuPermissions,
        },
      },
    };
  }
  static get permissions(): {
    global: PermissionT[];
    environment: EnvironmentPermissionT[];
  } {
    return {
      global: [
        ...RolePermission.userPermissions,
        ...RolePermission.rolePermissions,
        ...RolePermission.mediaPermissions,
        ...RolePermission.settingsPermissions,
        ...RolePermission.environmentPermissions,
      ],
      environment: [
        ...RolePermission.contentPermissions,
        ...RolePermission.categoryPermissions,
        ...RolePermission.menuPermissions,
      ],
    };
  }
  // GET SUB PERMISSIONS
  static get userPermissions(): PermissionUsers[] {
    return ["create_user", "read_user", "update_user", "delete_user"];
  }
  static get rolePermissions(): PermissionRoles[] {
    return [
      "create_role",
      "read_role",
      "update_role",
      "delete_role",
      "assign_role",
    ];
  }
  static get mediaPermissions(): PermissionMedia[] {
    return ["create_media", "read_media", "update_media", "delete_media"];
  }
  static get settingsPermissions(): PermissionSettings[] {
    return ["update_settings"];
  }
  static get environmentPermissions(): PermissionEnvironment[] {
    return ["update_environment", "migrate_environment"];
  }
  static get contentPermissions(): PermissionContent[] {
    return [
      "create_content",
      "read_content",
      "update_content",
      "delete_content",
      "publish_content",
      "unpublish_content",
    ];
  }
  static get categoryPermissions(): PermissionCategory[] {
    return ["create_category", "update_category", "delete_category"];
  }
  static get menuPermissions(): PermissionMenu[] {
    return ["create_menu", "read_menu", "update_menu", "delete_menu"];
  }
}
