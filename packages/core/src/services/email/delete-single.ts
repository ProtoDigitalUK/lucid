// Models
import Email from "@db/models/Email";

interface ServiceData {
  id: number;
}

const deleteSingle = async (data: ServiceData) => {
  const email = await Email.deleteSingle(data.id);

  return email;
};

export default deleteSingle;
