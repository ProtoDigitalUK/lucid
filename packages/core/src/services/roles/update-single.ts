// Models
import Role from "@db/models/Role";

interface ServiceData {
  id: number;
  name: string;
  permission_groups: Array<{
    environment_key?: string;
    permissions: string[];
  }>;
}

const updateSingle = async (data: ServiceData) => {
  const role = await Role.updateSingle(data.id, {
    name: data.name,
    permission_groups: data.permission_groups,
  });

  return role;
};

export default updateSingle;
