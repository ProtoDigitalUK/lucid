import type { PermissionGroupKey, PermissionGroup } from "../types/response.js";

const permissionGroups: Record<PermissionGroupKey, PermissionGroup> = {
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
	emails: {
		key: "emails_permissions",
		permissions: ["read_email", "delete_email", "send_email"],
	},
	content: {
		key: "content_permissions",
		permissions: ["create_content", "update_content", "delete_content"],
	},
};

export default permissionGroups;
