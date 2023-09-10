import { PoolClient } from "pg";
// Utils
import service from "@utils/app/service.js";
// Types
import { ServiceData as EmailParamsT } from "@services/email/send-email.js";
// Services
import emailService from "@services/email/index.js";

export interface ServiceData {
  template: string;
  params: EmailParamsT;
  id?: number;
  track?: boolean;
}

const sendInternal = async (client: PoolClient, data: ServiceData) => {
  const result = await emailService.sendEmail(data.template, data.params);

  if (data.track) {
    if (!data.id) {
      // Save the email to the database
      await service(
        emailService.createSingle,
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
      });
    } else {
      await service(
        emailService.updateSingle,
        false,
        client
      )({
        id: data.id,
        data: {
          from_address: result.options.from,
          from_name: result.options.fromName,
          delivery_status: result.success ? "sent" : "failed",
        },
      });
    }
  }

  // Return the result
  return {
    success: result.success,
    message: result.message,
  };
};

export default sendInternal;
