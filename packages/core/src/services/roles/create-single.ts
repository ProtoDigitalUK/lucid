import { PoolClient } from "pg";
// Utils
import { LucidError } from "@utils/app/error-handler";
import service from "@utils/app/service";
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

const createSingle = async (client: PoolClient, data: ServiceData) => {
  const parsePermissions = await service(
    roleServices.validatePermissions,
    false,
    client
  )(data.permission_groups);

  // check if role name is unique
  await service(
    roleServices.checkNameIsUnique,
    false,
    client
  )({
    name: data.name,
  });

  const role = await Role.createSingle(client, {
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
    await service(
      rolePermServices.createMultiple,
      false,
      client
    )({
      role_id: role.id,
      permissions: parsePermissions,
    });
  }

  return role;
};

export default createSingle;
