// Models
import Email from "@db/models/Email";

export interface ServiceData {
  id: number;
}

const getSingle = async (data: ServiceData) => {
  const email = await Email.getSingle(data.id);

  return email;
};

export default getSingle;
