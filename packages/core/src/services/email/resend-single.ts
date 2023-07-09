// Models
import Email from "@db/models/Email";

export interface ServiceData {
  id: number;
}

const resendSingle = async (data: ServiceData) => {
  const email = await Email.resendSingle(data.id);

  return email;
};

export default resendSingle;
