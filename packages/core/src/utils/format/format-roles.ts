// Models
import { RoleT } from "@db/models/Role";
// Types
import { RoleResT } from "@lucid/types/src/roles";

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
