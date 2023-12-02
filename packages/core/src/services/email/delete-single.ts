import { PoolClient } from "pg";
// Utils
import { HeadlessError } from "@utils/app/error-handler.js";
// Models
import Email from "@db/models/Email.js";

export interface ServiceData {
  id: number;
}

const deleteSingle = async (client: PoolClient, data: ServiceData) => {
  const email = await Email.deleteSingle(client, {
    id: data.id,
  });

  if (!email) {
    throw new HeadlessError({
      type: "basic",
      name: "Email",
      message: "Email not found",
      status: 404,
    });
  }

  return email;
};

export default deleteSingle;
