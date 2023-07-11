// Models
import { UserT } from "@db/models/User";
// Services
import { UserResT } from "@services/users";
import { UserPermissionsRes } from "@services/users/format-permissions";

const formatUser = (
  user: UserT,
  permissions?: UserPermissionsRes
): UserResT => {
  return {
    id: user.id,
    super_admin: user.super_admin,
    email: user.email,
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    roles: permissions?.roles,
    permissions: permissions?.permissions,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
};

export default formatUser;
