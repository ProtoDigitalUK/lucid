// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import Role from "@db/models/Role";
// Services
import roleServices from "@services/roles";
import rolePermServices from "@services/role-permissions";

export interface ServiceData {
  name: string;
  permission_groups: Array<{
    environment_key?: string;
    permissions: string[];
  }>;
}

const createSingle = async (data: ServiceData) => {
  const parsePermissions = await roleServices.validatePermissions(
    data.permission_groups
  );

  // check if role name is unique
  await roleServices.checkNameIsUnique({
    name: data.name,
  });

  const role = await Role.createSingle({
    name: data.name,
    permission_groups: data.permission_groups,
  });

  if (!role) {
    throw new LucidError({
      type: "basic",
      name: "Role Error",
      message: "There was an error creating the role.",
      status: 500,
    });
  }

  if (data.permission_groups.length > 0) {
    try {
      await rolePermServices.createMultiple({
        role_id: role.id,
        permissions: parsePermissions,
      });
    } catch (error) {
      await Role.deleteSingle({
        id: role.id,
      });
      throw error;
    }
  }

  return role;
};

export default createSingle;
