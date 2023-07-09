// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import User from "@db/models/User";

interface ServiceData {
  username: string;
  password: string;
}

const login = async (data: ServiceData) => {
  const user = await User.login({
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

  const passwordValid = await User.validatePassword(
    user.password,
    data.password
  );

  if (!passwordValid) {
    throw new LucidError({
      type: "basic",
      name: "User Not Found",
      message: "The email or password you entered is incorrect.",
      status: 500,
    });
  }

  delete user.password;

  return user;
};

export default login;
