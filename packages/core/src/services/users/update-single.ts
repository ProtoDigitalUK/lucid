// Utils
import { LucidError, ErrorResult, modelErrors } from "@utils/app/error-handler";
// Models
import User from "@db/models/User";
// Services
import usersServices from "@services/users";
import roleServices from "@services/roles";

export interface ServiceData {
  user_id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
  password?: string;
  role_ids?: number[];
}

const updateSingle = async (data: ServiceData) => {
  // -------------------------------------------
  // Unique Checks
  const [usernameCheck, emailCheck] = await Promise.all([
    // Check username
    data.username !== undefined
      ? User.getByUsername({ username: data.username })
      : Promise.resolve(undefined),
    // Check email
    data.email !== undefined
      ? User.getByEmail({ email: data.email })
      : Promise.resolve(undefined),
  ]);

  if (usernameCheck !== undefined || emailCheck !== undefined) {
    const errors: ErrorResult = {};
    if (emailCheck) {
      errors.email = {
        code: "email_already_exists",
        message: "A user with that email already exists.",
      };
    }
    if (usernameCheck) {
      errors.username = {
        code: "username_already_exists",
        message: "A user with that username already exists.",
      };
    }
    throw new LucidError({
      type: "basic",
      name: "User Already Exists",
      message: "A user with that email or username already exists.",
      status: 400,
      errors: modelErrors(errors),
    });
  }

  // -------------------------------------------
  // Update User
};

export default updateSingle;
