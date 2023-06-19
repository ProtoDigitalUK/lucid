import client from "@db/db";
import { LucidError } from "@utils/error-handler";

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
  | `create_content:environment_key`
  | `read_content:environment_key`
  | `update_content:environment_key`
  | `delete_content:environment_key`
  | `publish_content:environment_key`
  | `unpublish_content:environment_key`
  | `create_category:environment_key`
  | `update_category:environment_key`
  | `delete_category:environment_key`
  | `create_menu:environment_key`
  | `read_menu:environment_key`
  | `update_menu:environment_key`
  | `delete_menu:environment_key`
  | "create_media"
  | "read_media"
  | "update_media"
  | "delete_media"
  | "update_environment"
  | "migrate_environment"
  | "update_settings";

type RolePermissionSet = () => Promise<RolePermissionT>;

// -------------------------------------------
// User
export type RolePermissionT = {
  id: string;
  role_id: string;
  permission: string;

  created_at: string;
  updated_at: string;
};

export default class RolePermission {
  // -------------------------------------------
  // Functions
  static set: RolePermissionSet = async () => {
    return {} as RolePermissionT;
  };
  // -------------------------------------------
  // Util Functions
  // -------------------------------------------
  // Getters
  static get permissions(): PermissionT[] {
    return [
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
      // Content
      `create_content:environment_key`,
      `read_content:environment_key`,
      `update_content:environment_key`,
      `delete_content:environment_key`,
      `publish_content:environment_key`,
      `unpublish_content:environment_key`,
      // Categories
      `create_category:environment_key`,
      `update_category:environment_key`,
      `delete_category:environment_key`,
      // Menus
      `create_menu:environment_key`,
      `read_menu:environment_key`,
      `update_menu:environment_key`,
      `delete_menu:environment_key`,
      // Media
      "create_media",
      "read_media",
      "update_media",
      "delete_media",
      // Environment Management
      "update_environment",
      "migrate_environment",
      // Settings
      "update_settings",
    ];
  }
}
