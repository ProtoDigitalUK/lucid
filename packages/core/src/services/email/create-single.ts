import { PoolClient } from "pg";
import { format, getHours } from "date-fns";
import crypto from "crypto";
// Utils
import { LucidError } from "@utils/app/error-handler.js";
// Models
import Email from "@db/models/Email.js";

export interface ServiceData {
  from_address?: string;
  from_name?: string;
  to_address?: string;
  subject?: string;
  cc?: string;
  bcc?: string;
  template: string;
  delivery_status: "sent" | "failed" | "pending";
  type: "internal" | "external";
  data?: Record<string, any>;
}

const createSingle = async (client: PoolClient, data: ServiceData) => {
  // Create hash
  const date = format(new Date(), "dd/MM/yyyy");
  const currentHour = getHours(new Date());
  const hashString = `${JSON.stringify(data)}${
    data.template
  }${date}${currentHour}`;

  const hash = crypto.createHash("sha256").update(hashString).digest("hex");

  // Create data
  const email = await Email.createSingle(client, {
    from_address: data.from_address,
    from_name: data.from_name,
    to_address: data.to_address,
    subject: data.subject,
    cc: data.cc,
    bcc: data.bcc,
    template: data.template,
    data: data.data,
    delivery_status: data.delivery_status,
    type: data.type,
    email_hash: hash,
    sent_count: data.delivery_status === "sent" ? 1 : 0,
  });

  if (!email) {
    throw new LucidError({
      type: "basic",
      name: "Email",
      message: "Error saving email",
      status: 500,
    });
  }

  return email;
};

export default createSingle;
