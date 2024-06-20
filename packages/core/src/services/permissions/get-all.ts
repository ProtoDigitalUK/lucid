import Formatter from "../../libs/formatters/index.js";
import permissionGroups from "../../constants/permission-groups.js";
import type { ServiceFn } from "../../utils/services/types.js";
import type { Permission } from "../../types/response.js";

const getAll: ServiceFn<[], Permission[]> = async () => {
	const PermissionsFormatter = Formatter.get("permissions");

	const formattedPermissions = PermissionsFormatter.formatMultiple({
		permissions: permissionGroups,
	});

	return {
		error: undefined,
		data: formattedPermissions.flatMap((group) => group.permissions),
	};
};

export default getAll;
