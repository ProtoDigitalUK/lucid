import type { PermissionGroup } from "@headless/types/src/permissions.js";

const formatPermissions = (
	permissions: Record<string, PermissionGroup>,
): PermissionGroup[] => {
	return [
		permissions.users,
		permissions.roles,
		permissions.media,
		permissions.settings,
		permissions.emails,
		permissions.languages,
		permissions.content,
		permissions.collections,
		permissions.menu,
		permissions.form_submissions,
	];
};

export default formatPermissions;
