export default {
  pagination: {
    page: "1",
    per_page: "10",
  },
  permissions: {
    // Users
    create_user: "create_user",
    read_user: "read_user",
    update_user: "update_user",
    delete_user: "delete_user",
    // Roles
    create_role: "create_role",
    read_role: "read_role",
    update_role: "update_role",
    delete_role: "delete_role",
    assign_role: "assign_role",
    // Content
    create_content: "create_content", // covers all collections
    read_content: "read_content", // covers all collections
    update_content: "update_content", // covers all collections
    delete_content: "delete_content", // covers all collections
    publish_content: "publish_content", // covers all collections
    unpublish_content: "unpublish_content", // covers all collections
    // Categories - users read_content permission covers all categories
    create_category: "create_category",
    update_category: "update_category",
    delete_category: "delete_category",
    // Menus
    create_menu: "create_menu",
    read_menu: "read_menu",
    update_menu: "update_menu",
    delete_menu: "delete_menu",
    // Media
    create_media: "create_media",
    read_media: "read_media",
    update_media: "update_media",
    delete_media: "delete_media",
    // Environment Management
    update_environment: "update_environment",
    migrate_environment: "migrate_environment",
    // Settings
    update_settings: "update_settings",
  },
};
