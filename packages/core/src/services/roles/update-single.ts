import { PoolClient } from "pg";
// Utils
import { LucidError } from "@utils/app/error-handler";
import service from "@utils/app/service";
// Models
import Role from "@db/models/Role";
// Serivces
import roleServices from "@services/roles";
import rolePermServices from "@services/role-permissions";
// Format
import formatRole from "@utils/format/format-roles";

export interface ServiceData {
  id: number;
  name?: string;
  permission_groups?: Array<{
    environment_key?: string;
    permissions: string[];
  }>;
}

const updateSingle = async (client: PoolClient, data: ServiceData) => {
  if (data.name) {
    await service(
      roleServices.checkNameIsUnique,
      false,
      client
    )({
      name: data.name,
    });
  }

  const role = await Role.updateSingle(client, {
    id: data.id,
    data: {
      name: data.name,
      updated_at: new Date().toISOString(),
    },
  });

  if (!role) {
    throw new LucidError({
      type: "basic",
      name: "Role Error",
      message: "There was an error updating the role.",
      status: 500,
    });
  }

  if (data.permission_groups !== undefined) {
    const parsePermissions = await service(
      roleServices.validatePermissions,
      false,
      client
    )(data.permission_groups);

    await service(
      rolePermServices.deleteAll,
      false,
      client
    )({
      role_id: data.id,
    });
    if (data.permission_groups.length > 0) {
      await service(
        rolePermServices.createMultiple,
        false,
        client
      )({
        role_id: data.id,
        permissions: parsePermissions,
      });
    }
  }

  return formatRole(role);
};

export default updateSingle;
