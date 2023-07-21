// Models
import { UserT } from "@db/models/User";
// Types
import { UserPermissionsResT, UserResT } from "@lucid/types/src/users";

const formatUser = (
  user: UserT,
  permissions?: UserPermissionsResT
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
    reset_password: user.reset_password,
  };
};

export default formatUser;
