// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import Role from "@db/models/Role";
// Serivces
import roleServices from "@services/roles";
import rolePermServices from "@services/role-permissions";

export interface ServiceData {
  id: number;
  name?: string;
  permission_groups: Array<{
    environment_key?: string;
    permissions: string[];
  }>;
}

const updateSingle = async (data: ServiceData) => {
  const parsePermissions = await roleServices.validatePermissions(
    data.permission_groups
  );

  if (data.name) {
    await roleServices.checkNameIsUnique({
      name: data.name,
    });
  }

  const role = await Role.updateSingle(data.id, {
    name: data.name,
    permission_groups: data.permission_groups,
  });

  if (!role) {
    throw new LucidError({
      type: "basic",
      name: "Role Error",
      message: "There was an error updating the role.",
      status: 500,
    });
  }

  if (data.permission_groups.length > 0) {
    await rolePermServices.deleteAll({
      role_id: role.id,
    });
    await rolePermServices.createMultiple({
      role_id: role.id,
      permissions: parsePermissions,
    });
  }

  return role;
};

export default updateSingle;
