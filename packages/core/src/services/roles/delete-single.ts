import { PoolClient } from "pg";
// Utils
import { LucidError } from "@utils/app/error-handler.js";
// Models
import Role from "@db/models/Role.js";
// Format
import formatRole from "@utils/format/format-roles.js";

export interface ServiceData {
  id: number;
}

const deleteSingle = async (client: PoolClient, data: ServiceData) => {
  const role = await Role.deleteSingle(client, {
    id: data.id,
  });

  if (!role) {
    throw new LucidError({
      type: "basic",
      name: "Role Error",
      message: "There was an error deleting the role.",
      status: 500,
    });
  }

  return formatRole(role);
};

export default deleteSingle;
