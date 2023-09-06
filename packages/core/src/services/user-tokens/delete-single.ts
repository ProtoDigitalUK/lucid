import { PoolClient } from "pg";
// Models
import UserToken from "@db/models/UserToken.js";

export interface ServiceData {
  id: number;
}

const deleteSingle = async (client: PoolClient, data: ServiceData) => {
  const userToken = await UserToken.deleteSingle(client, {
    id: data.id,
  });

  return userToken;
};

export default deleteSingle;
