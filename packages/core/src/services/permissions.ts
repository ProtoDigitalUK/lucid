import type { PermissionGroupKey, PermissionGroup } from "../types/response.js";
import Formatter from "../libs/formatters/index.js";

export const permissionGroups: Record<PermissionGroupKey, PermissionGroup> = {
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

const getPermissions = () => {
	const PermissionsFormatter = Formatter.get("permissions");

	const formattedPermissions = PermissionsFormatter.formatMultiple({
		permissions: permissionGroups,
	});

	return formattedPermissions.flatMap((group) => group.permissions);
};

export default getPermissions;
