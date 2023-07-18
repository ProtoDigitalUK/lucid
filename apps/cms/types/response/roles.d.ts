interface RoleRes {
  id: number;
  name: string;

  permissions?: Array<{
    id: number;
    permission: string;
    environment_key: string | null;
  }>;

  created_at?: string;
  updated_at?: string;
}
