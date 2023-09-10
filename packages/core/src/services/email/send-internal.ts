import { PoolClient } from "pg";
// Utils
import service from "@utils/app/service.js";
// Types
import { ServiceData as EmailParamsT } from "@services/email/send-email.js";
import { EmailT } from "@db/models/Email.js";
// Services
import emailServices from "@services/email/index.js";

export interface ServiceData {
  template: string;
  params: EmailParamsT;
  email?: EmailT;
}

// Used to send emails within the application, can resend external emaisl
const sendInternal = async (client: PoolClient, data: ServiceData) => {
  const result = await emailServices.sendEmail(data.template, data.params);

  if (data.email !== undefined) {
    await service(
      emailServices.updateSingle,
      false,
      client
    )({
      id: data.email.id,
      data: {
        from_address: result.options.from,
        from_name: result.options.fromName,
        delivery_status: result.success ? "sent" : "failed",
        sent_count: data.email.sent_count + 1,
      },
    });
  } else {
    // Save the email to the database
    await service(
      emailServices.createSingle,
      false,
      client
    )({
      from_address: result.options.from,
      from_name: result.options.fromName,
      to_address: result.options.to,
      subject: result.options.subject,
      cc: result.options.cc,
      bcc: result.options.bcc,
      template: data.template,
      data: data.params.data,
      delivery_status: result.success ? "sent" : "failed",
      type: "internal",
    });
  }

  // Return the result
  return {
    success: result.success,
    message: result.message,
  };
};

export default sendInternal;
