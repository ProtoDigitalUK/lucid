// -------------------------------------------
// Types
export type PermissionUsers =
  | "create_user"
  | "read_user"
  | "update_user"
  | "delete_user";
export type PermissionRoles =
  | "create_role"
  | "read_role"
  | "update_role"
  | "delete_role"
  | "assign_role";
export type PermissionMedia =
  | "create_media"
  | "read_media"
  | "update_media"
  | "delete_media";
export type PermissionSettings = "update_settings";
export type PermissionEnvironment =
  | "update_environment"
  | "migrate_environment"
  | "delete_environment"
  | "create_environment";
export type PermissionEmails = "read_email" | "delete_email" | "send_email";
// env permissions
export type PermissionContent =
  | "create_content"
  | "read_content"
  | "update_content"
  | "delete_content"
  | "publish_content"
  | "unpublish_content";
export type PermissionCategory =
  | "create_category"
  | "read_category"
  | "update_category"
  | "delete_category";
export type PermissionMenu =
  | "create_menu"
  | "read_menu"
  | "update_menu"
  | "delete_menu";
export type PermissionFormSubmissions =
  | "read_form_submissions"
  | "delete_form_submissions"
  | "update_form_submissions";

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

export default class Permissions {
  static get formattedPermissions() {
    return {
      global: {
        users: {
          title: "Users",
          permissions: Permissions.userPermissions,
        },
        roles: {
          title: "Roles",
          permissions: Permissions.rolePermissions,
        },
        media: {
          title: "Media",
          permissions: Permissions.mediaPermissions,
        },
        settings: {
          title: "Settings",
          permissions: Permissions.settingsPermissions,
        },
        environment: {
          title: "Environment",
          permissions: Permissions.environmentPermissions,
        },
        emails: {
          title: "Emails",
          permissions: Permissions.emailPermissions,
        },
      },
      environment: {
        content: {
          title: "Content",
          permissions: Permissions.contentPermissions,
        },
        category: {
          title: "Category",
          permissions: Permissions.categoryPermissions,
        },
        menu: {
          title: "Menu",
          permissions: Permissions.menuPermissions,
        },
        form_submissions: {
          title: "Form Submissions",
          permissions: Permissions.formSubmissionsPermissions,
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
        ...Permissions.userPermissions,
        ...Permissions.rolePermissions,
        ...Permissions.mediaPermissions,
        ...Permissions.settingsPermissions,
        ...Permissions.environmentPermissions,
        ...Permissions.emailPermissions,
      ],
      environment: [
        ...Permissions.contentPermissions,
        ...Permissions.categoryPermissions,
        ...Permissions.menuPermissions,
        ...Permissions.formSubmissionsPermissions,
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
    return [
      "update_environment",
      "migrate_environment",
      "delete_environment",
      "create_environment",
    ];
  }
  static get emailPermissions(): PermissionEmails[] {
    return ["send_email", "read_email", "delete_email"];
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
  static get formSubmissionsPermissions(): PermissionFormSubmissions[] {
    return [
      "read_form_submissions",
      "delete_form_submissions",
      "update_form_submissions",
    ];
  }
}
