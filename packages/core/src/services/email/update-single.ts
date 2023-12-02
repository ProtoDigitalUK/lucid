import { PoolClient } from "pg";
// Utils
import { HeadlessError } from "@utils/app/error-handler.js";
// Models
import Email from "@db/models/Email.js";

export interface ServiceData {
  id: number;
  data: {
    from_address?: string;
    from_name?: string;
    delivery_status?: "sent" | "failed" | "pending";
    sent_count?: number;
  };
}

const updatteSingle = async (client: PoolClient, data: ServiceData) => {
  const email = await Email.updateSingle(client, {
    id: data.id,
    from_address: data.data.from_address,
    from_name: data.data.from_name,
    delivery_status: data.data.delivery_status,
    sent_count: data.data.sent_count,
  });

  if (!email) {
    throw new HeadlessError({
      type: "basic",
      name: "Error updating email",
      message: "There was an error updating the email",
      status: 500,
    });
  }
  return email;
};

export default updatteSingle;
