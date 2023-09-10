import { PoolClient } from "pg";
// Models
import Email from "@db/models/Email.js";
// Utils
import { LucidError } from "@utils/app/error-handler.js";
// Services
import emailServices from "@services/email/index.js";

export interface ServiceData {
  id: number;
}

const resendSingle = async (client: PoolClient, data: ServiceData) => {
  const email = await Email.getSingle(client, {
    id: data.id,
  });

  if (!email) {
    throw new LucidError({
      type: "basic",
      name: "Email",
      message: "Email not found",
      status: 404,
    });
  }
  const status = await emailServices.sendInternal(client, {
    template: email.template,
    params: {
      data: email.data || {},
      options: {
        to: email.to_address || "",
        subject: email.subject || "",
        from: email.from_address || undefined,
        fromName: email.from_name || undefined,
        cc: email.cc || undefined,
        bcc: email.bcc || undefined,
        replyTo: email.from_address || undefined,
      },
    },
    email: email,
  });

  return status;
};

export default resendSingle;
