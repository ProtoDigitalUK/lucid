// Models
import Role from "@db/models/Role";

export interface ServiceData {
  name: string;
  permission_groups: Array<{
    environment_key?: string;
    permissions: string[];
  }>;
}

const createSingle = async (data: ServiceData) => {
  const role = await Role.createSingle({
    name: data.name,
    permission_groups: data.permission_groups,
  });

  return role;
};

export default createSingle;
