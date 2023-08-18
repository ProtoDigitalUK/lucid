// Models
import { RoleT } from "@db/models/Role";
// Types
import { RoleResT } from "@lucid/types/src/roles";

const formatRole = (role: RoleT): RoleResT => {
  return role;
};

export default formatRole;
