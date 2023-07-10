// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import Email from "@db/models/Email";

export interface ServiceData {
  id: number;
}

const deleteSingle = async (data: ServiceData) => {
  const email = await Email.deleteSingle(data.id);

  if (email) {
    throw new LucidError({
      type: "basic",
      name: "Email",
      message: "Email not found",
      status: 404,
    });
  }

  return email;
};

export default deleteSingle;
