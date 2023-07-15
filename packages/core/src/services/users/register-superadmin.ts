// Utils
import { LucidError } from "@utils/app/error-handler";
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

const registerSuperAdmin = async (data: ServiceData) => {
  const initialUserRes = await optionServices.getByName({
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

  const user = await usersServices.registerSingle({
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    username: data.username,
    password: data.password,
    super_admin: true,
  });

  await optionServices.patchByName({
    name: "initial_user_created",
    value: true,
    type: "boolean",
  });

  return user;
};

export default registerSuperAdmin;