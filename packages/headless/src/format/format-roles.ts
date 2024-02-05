import { RoleResT } from "@headless/types/src/roles.js";
import { type RolesWithRelationsT } from "../db/schema.js";

const formatRole = (role: RolesWithRelationsT): RoleResT => {
	const roleF: RoleResT = {
		id: role.id,
		name: role.name,
		created_at: role.created_at,
		updated_at: role.updated_at,
	};
	if (role.permissions) {
		roleF.permissions = role.permissions?.filter(
			(permission) => permission.id !== null,
		);
	}

	return roleF;
};

export default formatRole;
