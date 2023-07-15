import { PoolClient } from "pg";
// Utils
import { LucidError } from "@utils/app/error-handler";
import service from "@utils/app/service";
// Services
import usersServices from "@services/users";
import optionServices from "@services/options";

export interface ServiceData {
  email: string;
  username: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

const registerSuperAdmin = async (client: PoolClient, data: ServiceData) => {
  const initialUserRes = await service(
    optionServices.getByName,
    false,
    client
  )({
    name: "initial_user_created",
  });
  const resValue = initialUserRes.option_value as boolean;

  if (resValue) {
    throw new LucidError({
      type: "basic",
      name: "Initial User Already Created",
      message: "The initial super admin user has already been created.",
      status: 400,
    });
  }

  const user = await service(
    usersServices.registerSingle,
    false,
    client
  )({
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    username: data.username,
    password: data.password,
    super_admin: true,
  });

  await service(
    optionServices.patchByName,
    false,
    client
  )({
    name: "initial_user_created",
    value: true,
    type: "boolean",
  });

  return user;
};

export default registerSuperAdmin;
