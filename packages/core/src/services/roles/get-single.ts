// Models
import Role from "@db/models/Role";

interface ServiceData {
  id: number;
}

const getSingle = async (data: ServiceData) => {
  const role = await Role.getSingle(data.id);

  return role;
};

export default getSingle;
