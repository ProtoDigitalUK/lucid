import { PoolClient } from "pg";
// Utils
import { LucidError } from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";
// Models
import User from "@db/models/User.js";
// Serices
import userServices from "@services/users/index.js";
// Format
import formatUser from "@utils/format/format-user.js";

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
