// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import Email from "@db/models/Email";

export interface ServiceData {
  from_address?: string;
  from_name?: string;
  to_address?: string;
  subject?: string;
  cc?: string;
  bcc?: string;
  template: string;
  delivery_status: "sent" | "failed" | "pending";
  data?: {
    [key: string]: any;
  };
}

const createSingle = async (data: ServiceData) => {
  const email = await Email.createSingle(data);

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
