import argon2 from "argon2";
// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import User from "@db/models/User";
// Serices
import userServices from "@services/users";
// Format
import formatUser from "@utils/format/format-user";

export interface ServiceData {
  user_id: number;
  password: string;
}

const updatePassword = async (data: ServiceData) => {
  // -------------------------------------------
  // Check if user exists and get them
  await userServices.getSingle({
    user_id: data.user_id,
  });

  // -------------------------------------------
  // Update the user's password
  const hashedPassword = await argon2.hash(data.password);
  const user = await User.updatePassword(data.user_id, hashedPassword);

  if (!user) {
    throw new LucidError({
      type: "basic",
      name: "User Not Updated",
      message: "The user's password was not updated.",
      status: 500,
    });
  }

  return formatUser(user);
};

export default updatePassword;
