import type { PermissionGroup } from "@headless/types/src/permissions.js";

interface FormatPermissionsT {
	permissions: Record<string, PermissionGroup>;
}

const formatPermissions = (props: FormatPermissionsT): PermissionGroup[] => {
	return [
		props.permissions.users,
		props.permissions.roles,
		props.permissions.media,
		props.permissions.settings,
		props.permissions.emails,
		props.permissions.languages,
		props.permissions.content,
		props.permissions.menu,
		props.permissions.form_submissions,
	];
};

export default formatPermissions;
