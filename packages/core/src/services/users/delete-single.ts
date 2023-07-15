import { PoolClient } from "pg";
// Utils
import { LucidError } from "@utils/app/error-handler";
import service from "@utils/app/service";
// Models
import User from "@db/models/User";
// Serices
import userServices from "@services/users";
// Format
import formatUser from "@utils/format/format-user";

export interface ServiceData {
  user_id: number;
}

const deleteSingle = async (client: PoolClient, data: ServiceData) => {
  await service(
    userServices.getSingle,
    false,
    client
  )({
    user_id: data.user_id,
  });

  const user = await User.deleteSingle(client, {
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
