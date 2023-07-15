// Models
import { UserT } from "@db/models/User";
// Services
import { UserPermissionsResT } from "@utils/format/format-user-permissions";

// -------------------------------------------
// Types
export interface UserResT {
  id: number;
  super_admin?: boolean;
  email: string;
  username: string;
  first_name: string | null;
  last_name: string | null;

  roles?: UserPermissionsResT["roles"];
  permissions?: UserPermissionsResT["permissions"];

  created_at: string;
  updated_at: string;
}

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
  };
};

export default formatUser;
