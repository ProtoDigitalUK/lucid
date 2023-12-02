import { PoolClient } from "pg";
import crypto from "crypto";
// Utils
import { HeadlessError } from "@utils/app/error-handler.js";
// Models
import UserToken, { UserTokenT } from "@db/models/UserToken.js";

export interface ServiceData {
  user_id: number;
  token_type: UserTokenT["token_type"];
  expiry_date: string;
}

const createSingle = async (client: PoolClient, data: ServiceData) => {
  const token = crypto.randomBytes(32).toString("hex");

  const userToken = await UserToken.createSingle(client, {
    user_id: data.user_id,
    token_type: data.token_type,
    token,
    expiry_date: data.expiry_date,
  });

  if (!userToken) {
    throw new HeadlessError({
      type: "basic",
      name: "Error creating user token",
      message: "There was an error creating the user token.",
      status: 500,
    });
  }

  return userToken;
};

export default createSingle;
