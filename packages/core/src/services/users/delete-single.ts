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
}

const deleteSingle = async (data: ServiceData) => {
  await userServices.getSingle({
    user_id: data.user_id,
  });

  const user = await User.deleteSingle({
    id: data.user_id,
  });

  if (!user) {
    throw new LucidError({
      type: "basic",
      name: "User Not Deleted",
      message: "The user was not deleted",
      status: 500,
    });
  }

  return formatUser(user);
};

export default deleteSingle;
