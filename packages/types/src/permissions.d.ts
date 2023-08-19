export type PermissionT =
  | "create_user"
  | "read_users"
  | "update_user"
  | "delete_user"
  | "create_role"
  | "read_role"
  | "update_role"
  | "delete_role"
  | "create_media"
  | "read_media"
  | "update_media"
  | "delete_media"
  | "update_environment"
  | "migrate_environment"
  | "delete_environment"
  | "create_environment"
  | "update_settings"
  | "read_email"
  | "delete_email"
  | "send_email";

export type EnvironmentPermissionT =
  | "create_content"
  | "read_content"
  | "update_content"
  | "delete_content"
  | "publish_content"
  | "unpublish_content"
  | "create_category"
  | "read_category"
  | "update_category"
  | "delete_category"
  | "create_menu"
  | "read_menu"
  | "update_menu"
  | "delete_menu"
  | "read_form_submissions"
  | "delete_form_submissions"
  | "update_form_submissions";

export type PermissionGroup = {
  key: string;
  permissions: PermissionT[] | EnvironmentPermissionT[];
};

export interface PermissionsResT {
  global: PermissionGroup[];
  environment: PermissionGroup[];
}
