// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import User from "@db/models/User";
import Option from "@db/models/Option";

interface ServiceData {
  email: string;
  username: string;
  password: string;
}

const registerSuperAdmin = async (data: ServiceData) => {
  const initialUserRes = await Option.getByName("initial_user_created");
  const resValue = initialUserRes.option_value as boolean;

  if (resValue) {
    throw new LucidError({
      type: "basic",
      name: "Initial User Already Created",
      message: "The initial super admin user has already been created.",
      status: 400,
    });
  }

  const user = await User.registerSuperAdmin({
    email: data.email,
    username: data.username,
    password: data.password,
  });

  return user;
};

export default registerSuperAdmin;
