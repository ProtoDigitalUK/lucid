import { UserPermissionsRes } from "./format-permissions";

// Services
import updateRoles from "./update-roles";
import formatPermissions from "./format-permissions";
import getAllRoles from "./get-all-roles";
import getPermissions from "./get-permissions";
import getSingle from "./get-single";
import format from "./format";

// -------------------------------------------
// Types
export interface UserResT {
  id: number;
  super_admin: boolean;
  email: string;
  username: string;
  first_name: string | null;
  last_name: string | null;

  roles?: UserPermissionsRes["roles"];
  permissions?: UserPermissionsRes["permissions"];

  created_at: string;
  updated_at: string;
}

// -------------------------------------------
// Exports
export default {
  updateRoles,
  formatPermissions,
  getAllRoles,
  getPermissions,
  getSingle,
  format,
};
