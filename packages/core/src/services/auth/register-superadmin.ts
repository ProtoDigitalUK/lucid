// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import User from "@db/models/User";
import Option from "@db/models/Option";
// Services
import usersServices from "@services/users";
import optionServices from "@services/options";

export interface ServiceData {
  email: string;
  username: string;
  password: string;
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

  const user = await User.register({
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

  return await usersServices.getSingle({
    userId: user.id,
  });
};

export default registerSuperAdmin;
