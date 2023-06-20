import z from "zod";
import client from "@db/db";
// Schema
import roleSchema from "@schemas/roles";
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
  | `create_content:environment_key=${string}`
  | `read_content:environment_key=${string}`
  | `update_content:environment_key=${string}`
  | `delete_content:environment_key=${string}`
  | `publish_content:environment_key=${string}`
  | `unpublish_content:environment_key=${string}`
  | `create_category:environment_key=${string}`
  | `update_category:environment_key=${string}`
  | `delete_category:environment_key=${string}`
  | `create_menu:environment_key=${string}`
  | `read_menu:environment_key=${string}`
  | `update_menu:environment_key=${string}`
  | `delete_menu:environment_key=${string}`
  | "create_media"
  | "read_media"
  | "update_media"
  | "delete_media"
  | "update_environment"
  | "migrate_environment"
  | "update_settings";

type RolePermissionUpsertMultiple = (
  role_id: number,
  permissions: Array<{
    permission: PermissionT;
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
  static upsertMultiple: RolePermissionUpsertMultiple = async (
    role_id,
    permissions
  ) => {
    console.log(permissions);

    return [] as RolePermissionT[];
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
      `create_content:environment_key=`,
      `read_content:environment_key=`,
      `update_content:environment_key=`,
      `delete_content:environment_key=`,
      `publish_content:environment_key=`,
      `unpublish_content:environment_key=`,
      // Categories
      `create_category:environment_key=`,
      `update_category:environment_key=`,
      `delete_category:environment_key=`,
      // Menus
      `create_menu:environment_key=`,
      `read_menu:environment_key=`,
      `update_menu:environment_key=`,
      `delete_menu:environment_key=`,
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
