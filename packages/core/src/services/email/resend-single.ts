import { PoolClient } from "pg";
// Utils
import service from "@utils/app/service.js";
// Services
import emailServices from "@services/email/index.js";

export interface ServiceData {
  id: number;
}

const resendSingle = async (client: PoolClient, data: ServiceData) => {
  const email = await service(
    emailServices.getSingle,
    false,
    client
  )({
    id: data.id,
    renderTemplate: false,
  });

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
