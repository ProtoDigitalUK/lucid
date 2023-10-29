import { PermissionGroup } from "@lucid/types/src/permissions.js";
// Format
import formatPermissions from "@utils/format/format-permissions.js";

export default class Permissions {
  static get raw(): Record<string, PermissionGroup> {
    return {
      users: {
        key: "users_permissions",
        permissions: ["create_user", "update_user", "delete_user"],
      },
      roles: {
        key: "roles_permissions",
        permissions: ["create_role", "update_role", "delete_role"],
      },
      media: {
        key: "media_permissions",
        permissions: ["create_media", "update_media", "delete_media"],
      },
      settings: {
        key: "settings_permissions",
        permissions: ["update_settings"],
      },
      languages: {
        key: "languages_permissions",
        permissions: ["create_language", "update_language", "delete_language"],
      },
      environment: {
        key: "environment_permissions",
        permissions: [
          "update_environment",
          "migrate_environment",
          "delete_environment",
          "create_environment",
        ],
      },
      emails: {
        key: "emails_permissions",
        permissions: ["read_email", "delete_email", "send_email"],
      },
      content: {
        key: "content_permissions",
        permissions: [
          "create_content",
          "update_content",
          "delete_content",
          "publish_content",
          "unpublish_content",
        ],
      },
      category: {
        key: "category_permissions",
        permissions: ["create_category", "update_category", "delete_category"],
      },
      menu: {
        key: "menu_permissions",
        permissions: ["create_menu", "update_menu", "delete_menu"],
      },
      form_submissions: {
        key: "form_submissions_permissions",
        permissions: [
          "read_form_submissions",
          "delete_form_submissions",
          "update_form_submissions",
        ],
      },
    };
  }
  static get permissions() {
    const formattedPermissions = formatPermissions(Permissions.raw);

    const globalPermissions = formattedPermissions.global.flatMap(
      (group) => group.permissions
    );
    const environmentPermissions = formattedPermissions.environment.flatMap(
      (group) => group.permissions
    );
    return {
      global: globalPermissions,
      environment: environmentPermissions,
    };
  }
}
