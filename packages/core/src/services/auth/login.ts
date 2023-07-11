// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import User from "@db/models/User";
// Serices
import authServices from "@services/auth";
import usersServices from "@services/users";

export interface ServiceData {
  username: string;
  password: string;
}

const login = async (data: ServiceData) => {
  const user = await User.getByUsername({
    username: data.username,
  });

  if (!user || !user.password) {
    throw new LucidError({
      type: "basic",
      name: "User Not Found",
      message: "The email or password you entered is incorrect.",
      status: 500,
    });
  }

  const passwordValid = await authServices.validatePassword({
    hashedPassword: user.password,
    password: data.password,
  });

  if (!passwordValid) {
    throw new LucidError({
      type: "basic",
      name: "User Not Found",
      message: "The email or password you entered is incorrect.",
      status: 500,
    });
  }

  return await usersServices.getSingle({
    userId: user.id,
  });
};

export default login;
