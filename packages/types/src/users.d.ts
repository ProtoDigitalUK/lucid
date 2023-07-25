import {
  PermissionT,
  EnvironmentPermissionT,
} from "@lucid/core/src/services/Permissions";

// User
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

// User Permissions
export interface UserRoleResT {
  id: number;
  name: string;
}
export interface UserEnvrionmentResT {
  key: string;
  permissions: Array<EnvironmentPermissionT>;
}

export interface UserPermissionsResT {
  roles: UserRoleResT[];
  permissions: {
    global: PermissionT[];
    environments: UserEnvrionmentResT[];
  };
}
