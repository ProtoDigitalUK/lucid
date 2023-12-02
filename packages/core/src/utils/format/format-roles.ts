// Models
import { RoleT } from "@db/models/Role.js";
// Types
import { RoleResT } from "@headless/types/src/roles.js";

const formatRole = (role: RoleT): RoleResT => {
  let roleF: RoleResT = {
    id: role.id,
    name: role.name,
    created_at: role.created_at,
    updated_at: role.updated_at,
  };
  if (role.permissions) {
    roleF.permissions = role.permissions?.filter(
      (permission) => permission.id !== null
    );
  }
  return roleF;
};

export default formatRole;
