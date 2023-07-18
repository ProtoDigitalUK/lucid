interface UserRes {
  id: number;
  super_admin: boolean;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  roles: RoleRes[];
  permissions: {
    global: string[];
    environments: Array<{
      key: string;
      permissions: string[];
    }>;
  };
  created_at: string;
  updated_at: string;
}
