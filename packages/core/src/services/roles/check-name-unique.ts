import { PoolClient } from "pg";
// Utils
import { LucidError, modelErrors } from "@utils/app/error-handler";
// Models
import Role from "@db/models/Role";

export interface ServiceData {
  name: string;
}

const checkNameIsUnique = async (client: PoolClient, data: ServiceData) => {
  const role = await Role.getSingleByName(client, {
    name: data.name,
  });

  if (role) {
    throw new LucidError({
      type: "basic",
      name: "Role Error",
      message: "The role name must be unique.",
      status: 500,
      errors: modelErrors({
        name: {
          code: "Not unique",
          message: "The role name must be unique.",
        },
      }),
    });
  }

  return role;
};

export default checkNameIsUnique;
